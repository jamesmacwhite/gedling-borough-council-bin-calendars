import { parse } from 'node-html-parser';

export default {
  async fetch(request) {
    let viewState = '';
    let viewStateGenerator = '';
    let eventValidation = '';

    const refuseCollectionJsonKeys = ['Location', 'Area', 'Calendar URL', 'Email Subscribe URL', 'Schedule Identifier', 'Schedule Name'];
    const gardenWasteCollectionJsonKeys = ['Location', 'Numbers', 'Area', 'Calendar URL', 'Email Subscribe URL', 'Schedule Identifier', 'Schedule Name'];
    const gedlingAppDomainUrl = 'https://apps.gedling.gov.uk';
    
    let refuseCollectionData = [];
    let gardenWasteCollectionData = [];
    let refuseRowsHtml = '';
    let gardenWasteRowsHtml = '';

    function getCollectionIdentifier(url) {
      return url.split("/").pop() || null;
    }

    function formatRefuseCalendarPDFUrl(path) {
      return `${gedlingAppDomainUrl}/refuse/${path}`;
    }

    function formatGardenCalendarPDFUrl(path) {
      return `${gedlingAppDomainUrl}/${path.replace('../', '')}`;
    }

    function formatCollectionName(url) {
      
      let urlParsed = url.split("/").pop().split('-');

      if (urlParsed.length < 2) {
        return null;
      }

      // First part is the weekday
      let weekDay = urlParsed[0].replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });

      // Second part is the collection schedule name
      let schedule = urlParsed[1].toUpperCase();
      return `${weekDay} ${schedule}`;
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    };

    const url = new URL(request.url);
    const streetName = url.searchParams.get('streetName');

    if (request.method !== 'GET') {
      return new Response('This worker only supports GET requests', {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!streetName) {
      return new Response('Missing street name parameter', { 
        status: 400, 
        headers: corsHeaders
      });
    }

    const searchUrl = 'https://apps.gedling.gov.uk/refuse/search.aspx';
    const searchPage = await fetch(searchUrl);

    if (searchPage.status !== 200) {
      return new Response(`Request to ${searchUrl} failed.`, {
        status: 500,
        headers: corsHeaders
      });
    }

    // Obtain the __VIEWSTATE, __VIEWSTATEGENERATOR and __EVENTVALIDATION values for a valid POST request
    await new HTMLRewriter()
      .on('input#__VIEWSTATE', {
        element(elem) {
          viewState = elem.getAttribute('value');
        }
      })
      .on('input#__VIEWSTATEGENERATOR', {
        element(elem) {
          viewStateGenerator = elem.getAttribute('value');
        }
      })
      .on('input#__EVENTVALIDATION', {
        element(elem) {
          eventValidation = elem.getAttribute('value');
        }
      })
      .transform(searchPage)
      .text();

    // Build POST parameters
    let formData = new FormData();
    formData.append('__VIEWSTATE', viewState);
    formData.append('__EVENTVALIDATION', eventValidation);
    formData.append('ctl00$MainContent$street', streetName);
    formData.append('ctl00$MainContent$mybutton', 'Search');

    const searchRequest = await fetch(searchUrl, {
      method: 'POST',
      body: formData
    });

    await new HTMLRewriter()
      .on('table#ctl00_MainContent_streetgridview tbody', {
        text({ text }) { 
          refuseRowsHtml += text 
        },
      })
      .on('table#ctl00_MainContent_streetgridview tbody *', {
        element(el) { 
          const attrs = [...el.attributes].map(([k, v]) => ` ${k}="${v}"`).join('');
          refuseRowsHtml += `<${el.tagName}${attrs}>`;
          el.onEndTag(endTag => { 
            refuseRowsHtml += `</${endTag.name}>`;
          });
        }
      })
      .on('table#ctl00_MainContent_gardenGridView tbody', {
        text({ text }) { gardenWasteRowsHtml += text }
      })
      .on('table#ctl00_MainContent_gardenGridView tbody *', {
        element(el) {
          const attrs = [...el.attributes].map(([k, v]) => ` ${k}="${v}"`).join('');
          gardenWasteRowsHtml += `<${el.tagName}${attrs}>`;
          el.onEndTag(endTag => { 
            gardenWasteRowsHtml += `</${endTag.name}>`;
          });
        }
      })
      .transform(searchRequest)
      .text()

    let refuseData = parse(refuseRowsHtml).querySelectorAll('tr');
    let gardenWasteData = parse(gardenWasteRowsHtml).querySelectorAll('tr');

    let subscribeUrl = '';

    refuseData.forEach((row) => {
      const cells = row.removeWhitespace().querySelectorAll('td');
      const rowData = cells.map(function(cell) {

      if (cell.text === 'Download Calendar' || cell.text === 'Subscribe') {
        let href = cell.querySelector('a').getAttribute('href');

        if (cell.text === 'Download Calendar') {
            return formatRefuseCalendarPDFUrl(href);
        }

        if (cell.text === 'Subscribe') {
          subscribeUrl = href;
          return href;
        }
      }

        return cell.text;

      });

      rowData.push(getCollectionIdentifier(subscribeUrl));
      rowData.push(formatCollectionName(subscribeUrl));

      const rowObject = {};

      for (let i = 0; i < refuseCollectionJsonKeys.length; i++) {
          rowObject[refuseCollectionJsonKeys[i]] = rowData[i];
      }

      refuseCollectionData.push(rowObject);

    });

    gardenWasteData.forEach((row) => {
      const cells = row.removeWhitespace().querySelectorAll('td');
      const rowData = cells.map(function(cell, index) {

      if (cell.text === 'Download Calendar' || cell.text === 'Subscribe') {
        let href = cell.querySelector('a').getAttribute('href');

        if (cell.text === 'Download Calendar') {
            return formatGardenCalendarPDFUrl(href);
        }

        if (cell.text === 'Subscribe') {
          subscribeUrl = href;
          return href;
        }
      }

        return cell.text || null;

      });

      rowData.push(getCollectionIdentifier(subscribeUrl));
      rowData.push(formatCollectionName(subscribeUrl));

      const rowObject = {};

      for (let i = 0; i < gardenWasteCollectionJsonKeys.length; i++) {
          rowObject[gardenWasteCollectionJsonKeys[i]] = rowData[i];
      }

      gardenWasteCollectionData.push(rowObject);

    });

    if (refuseCollectionData.length === 0 && gardenWasteCollectionData.length === 0) {
      return new Response('The street name entered did not return any bin collection data. Please check the street name entered is valid, spelt correctly and within the Gedling district and try again.', {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      'streetNameQuery': streetName,
      'refuseCollections': refuseCollectionData,
      'gardenWasteCollections': gardenWasteCollectionData,
      'viewState': viewState || null,
      'viewStateGenerator': viewStateGenerator || null,
      'eventValidation': eventValidation || null
    }), { 
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...corsHeaders
      } 
    });
  },
};