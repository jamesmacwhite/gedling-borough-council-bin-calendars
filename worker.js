export default {
  async fetch(request) {
    let viewState = '';
    let viewStateGenerator = '';
    let eventValidation = '';
    let refuseCollectionEmailSubscribeUrl = '';
    let gardenWasteCollectionEmailSubscribeUrl = '';

    function getCollectionIdentifier(url) {
      return url.split("/").pop() || null;
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
        .on('a#ctl00_MainContent_streetgridview_ctl02_Hyperlink1', {
          element(elem) {
            refuseCollectionEmailSubscribeUrl = elem.getAttribute('href');
          }
        })
        .on('a#ctl00_MainContent_gardenGridView_ctl02_Hyperlink2', {
          element(elem) {
            gardenWasteCollectionEmailSubscribeUrl = elem.getAttribute('href');
          }
        })
        .transform(searchRequest)
        .text()


    if (!refuseCollectionEmailSubscribeUrl || !gardenWasteCollectionEmailSubscribeUrl) {
      return new Response('The street name entered did not return any bin collection data. Please check the street name entered is valid, spelt correctly and within the Gedling district and try again.', {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      'streetNameQuery': streetName,
      'refuseCollectionScheduleId': getCollectionIdentifier(refuseCollectionEmailSubscribeUrl),
      'refuseCollectionScheduleName': formatCollectionName(refuseCollectionEmailSubscribeUrl),
      'gardenWasteCollectionScheduleId': getCollectionIdentifier(gardenWasteCollectionEmailSubscribeUrl),
      'gardenWasteCollectionScheduleName': formatCollectionName(gardenWasteCollectionEmailSubscribeUrl),
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