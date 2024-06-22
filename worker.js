import { parse } from 'node-html-parser';

export default {

  async fetch(request, env) {

    if (request.method !== 'GET') {
      return new Response('This worker only supports GET requests', {
        status: 400,
        headers: corsHeaders
      })
    }

    const refuseCollectionJsonKeys = ['Location', 'Area', 'Calendar PDF URL', 'Email Subscribe URL', 'Schedule Identifier', 'Schedule Name', 'Calendar URL'];
    const gardenWasteCollectionJsonKeys = ['Location', 'Numbers', 'Area', 'Calendar PDF URL', 'Email Subscribe URL', 'Schedule Identifier', 'Schedule Name', 'Calendar URL'];
    const gedlingAppDomainUrl = 'https://apps.gedling.gov.uk';
    const refuseSearchUrl = `${gedlingAppDomainUrl}/refuse/search.aspx`;
    
    let refuseCollectionData = [];
    let gardenWasteCollectionData = [];

    function getAttributeValue(root, selector) {
      return parse(root).querySelector(selector).getAttribute('value');
    }

    function getCollectionIdentifier(url) {
      return url.split("/").pop() || null;
    }

    function formatRefuseCalendarPDFUrl(path) {
      return `${gedlingAppDomainUrl}/refuse/${path}`;
    }

    function formatGardenCalendarPDFUrl(path) {
      return `${gedlingAppDomainUrl}/${path.replace('../', '')}`;
    }

    function formatCollectionUrl(slug, $isGardenBinType = false) {

      let pathName = null;

      if ($isGardenBinType) {
        pathName = 'garden';
      }
      else {
        pathName = 'refuse';
      }

       return new URL(`collections/${pathName}/${slug}`, env.BASE_URL);
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

    const url = new URL(request.url);``
    const streetName = url.searchParams.get('streetName');

    if (!streetName) {
      return new Response('Missing street name parameter', { 
        status: 400, 
        headers: corsHeaders
      });
    }

    if (streetName.length < 5) {
      return new Response('Street name query should be 5 or more characters.', {
        status: 400,
        headers: corsHeaders
      });
    }

    if (streetName.match(/\d+/)) {
      return new Response('For more accurate results, please enter only street name values, no property numbers or other address information.', {
        status: 400,
        headers: corsHeaders
      });
    }

    // Make GET request to search page to get ASP.NET hidden input values required for POST request
    const searchPageFormData = await fetch(refuseSearchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${refuseSearchUrl}. HTTP error: ${response.status} ${response.statusText}.`);
        }

        return response.text();

      })
      .then((data) => {
        // Parse the input values needed
        return {
          '__VIEWSTATE': getAttributeValue(data, 'input#__VIEWSTATE'),
          '__VIEWSTATEGENERATOR': getAttributeValue(data, 'input#__VIEWSTATEGENERATOR'),
          '__EVENTVALIDATION': getAttributeValue(data, 'input#__EVENTVALIDATION')
        }
      })
      .catch((error) => {
        console.log(error);
      })

    // Build POST parameters for search
    let formData = new FormData();

    for (var key in searchPageFormData) {
      formData.append(key, searchPageFormData[key]);
    }

    // Pass the street value from URL query as form data
    formData.append('ctl00$MainContent$street', streetName);
    formData.append('ctl00$MainContent$mybutton', 'Search');

    const searchRequestResults = await fetch(refuseSearchUrl, {
      method: 'POST',
      body: formData
    }).then((response) => response.text());

    let refuseData = parse(searchRequestResults).querySelectorAll('table#ctl00_MainContent_streetgridview tbody tr');
    let gardenWasteData = parse(searchRequestResults).querySelectorAll('table#ctl00_MainContent_gardenGridView tbody tr');

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

      let identifier = getCollectionIdentifier(subscribeUrl);

      rowData.push(getCollectionIdentifier(identifier));
      rowData.push(formatCollectionName(subscribeUrl));
      rowData.push(formatCollectionUrl(identifier));

      const rowObject = {};

      for (const [key, value] of refuseCollectionJsonKeys.entries()) {
        rowObject[value] = rowData[key];
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

      let identifier = getCollectionIdentifier(subscribeUrl);

      rowData.push(getCollectionIdentifier(identifier));
      rowData.push(formatCollectionName(subscribeUrl));
      rowData.push(formatCollectionUrl(identifier, true));


      const rowObject = {};

      for (const [key, value] of gardenWasteCollectionJsonKeys.entries()) {
        rowObject[value] = rowData[key];
      }

      gardenWasteCollectionData.push(rowObject);

    });

    if (refuseCollectionData.length === 0 && gardenWasteCollectionData.length === 0) {
      return new Response('The street name value did not return any bin collection data. Please check the street name entered is valid and within the Gedling Borough Council district and try again.', {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      'streetNameQuery': streetName,
      'refuseCollections': refuseCollectionData,
      'gardenWasteCollections': gardenWasteCollectionData,
      'viewState': searchPageFormData['__VIEWSTATE'] || null,
      'viewStateGenerator': searchPageFormData['__VIEWSTATEGENERATOR'] || null,
      'eventValidation': searchPageFormData['__EVENTVALIDATION'] || null
    }), { 
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...corsHeaders
      } 
    });
  },
};