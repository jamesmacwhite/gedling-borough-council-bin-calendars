import { Router, cors, json } from 'itty-router';
import { parse } from 'node-html-parser';

const { preflight, corsify } = cors({
  allowMethods: ['GET'],
});

const router = Router({
  before: [preflight],
  finally: [corsify],
});

router.get('/', () => {
  return new Response('API worker is running.');
});

router.get('/street-search', async (request, env, ctx) => {
  const refuseCollectionJsonKeys = [
    'Location',
    'Area',
    'Calendar PDF URL',
    'Email Subscribe URL',
    'Schedule Identifier',
    'Schedule Name',
    'Calendar URL',
  ];

  const gardenWasteCollectionJsonKeys = [
    'Location',
    'Numbers',
    'Area',
    'Calendar PDF URL',
    'Email Subscribe URL',
    'Schedule Identifier',
    'Schedule Name',
    'Calendar URL',
  ];

  const gedlingAppsUrl = env.GEDLING_APPS_URL;
  const baseUrl = env.BASE_URL;

  if (!gedlingAppsUrl || !baseUrl) {
    return new Response('Server configuration error: missing GEDLING_APPS_URL or BASE_URL.', {
      status: 500,
    });
  }

  function getAttributeValue(html, selector) {
    const root = parse(html);
    const el = root.querySelector(selector);
    return el?.getAttribute('value') ?? null;
  }

  function getCollectionIdentifier(url) {
    if (!url) {
      return null;
    }

    const parts = url.split('/');

    return parts.pop() || null;
  }

  function formatRefuseCalendarPDFUrl(path) {
    if (!path) {
      return null;
    }

    return new URL(`/refuse/${path}`, gedlingAppsUrl).toString();
  }

  function formatGardenCalendarPDFUrl(path) {
    if (!path) {
      return null;
    }

    return new URL(path, gedlingAppsUrl).toString();
  }

  function formatCollectionUrl(slug, isGardenBinType = false) {
    if (!slug) { 
      return null;
    }

    const pathName = isGardenBinType ? 'garden' : 'refuse';
    return new URL(`collections/${pathName}/${slug}`, baseUrl).toString();
  }

  function formatCollectionName(url) {
    if (!url) { 
      return null;
    }

    const lastSegment = url.split('/').pop();

    if (!lastSegment) { 
      return null;
    }

    const parts = lastSegment.split('-');
    if (parts.length < 2) { 
      return null; 
    }

    const weekDay = parts[0].replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    const schedule = parts[1].toUpperCase();

    return `${weekDay} ${schedule}`;
  }

  const refuseSearchUrl = new URL('refuse/search.aspx', gedlingAppsUrl);

  const url = new URL(request.url);
  const streetName = url.searchParams.get('streetName');

    if (!streetName) {
      return new Response('Missing street name parameter.', {
        status: 400,
      });
    }

    if (streetName.length < 5) {
      return new Response('Street name query should be 5 or more characters.', {
        status: 400,
      });
    }

    if (/\d+/.test(streetName)) {
      return new Response(
        'For more accurate results, please enter only street name values, no property numbers or other address information.',
        { status: 400 }
      );
    }

  let refuseCollectionData = [];
  let gardenWasteCollectionData = [];

  try {
    const searchPageResponse = await fetch(refuseSearchUrl.toString());

    if (!searchPageResponse.ok) {
      return new Response(
        `Failed to fetch ${refuseSearchUrl}. HTTP error: ${searchPageResponse.status} ${searchPageResponse.statusText}.`,
        { status: 502 }
      );
    }

    const searchPageHtml = await searchPageResponse.text();

    const searchPageFormData = {
      __VIEWSTATE: getAttributeValue(searchPageHtml, 'input#__VIEWSTATE'),
      __VIEWSTATEGENERATOR: getAttributeValue(searchPageHtml, 'input#__VIEWSTATEGENERATOR'),
      __EVENTVALIDATION: getAttributeValue(searchPageHtml, 'input#__EVENTVALIDATION'),
    };

    if (!searchPageFormData.__VIEWSTATE || !searchPageFormData.__EVENTVALIDATION) {
      return new Response('Unable to parse required form fields from upstream site.', {
        status: 502,
      });
    }

    // 2. Build POST form data
    const formData = new FormData();

    for (const key in searchPageFormData) {
      if (searchPageFormData[key] != null) {
        formData.append(key, searchPageFormData[key]);
      }
    }

    formData.append('ctl00$MainContent$street', streetName);
    formData.append('ctl00$MainContent$mybutton', 'Search');

    // 3. POST search request
    const searchRequestResponse = await fetch(refuseSearchUrl.toString(), {
      method: 'POST',
      body: formData,
    });

    if (!searchRequestResponse.ok) {
      return new Response(
        `Failed to post search to ${refuseSearchUrl}. HTTP error: ${searchRequestResponse.status} ${searchRequestResponse.statusText}.`,
        { status: 502 }
      );
    }

    const searchRequestResults = await searchRequestResponse.text();
    const root = parse(searchRequestResults);

    const refuseRows = root.querySelectorAll(
      'table#ctl00_MainContent_streetgridview tbody tr'
    );
    const gardenRows = root.querySelectorAll(
      'table#ctl00_MainContent_gardenGridView tbody tr'
    );

    // 4. Parse refuse table
    if (refuseRows.length > 0) {
      let refuseSubscribeUrl = null;

      refuseRows.forEach((row) => {
        const cells = row.removeWhitespace().querySelectorAll('td');
        const rowData = cells.map((cell) => {
          const text = cell.text?.trim() ?? '';

          if (text === 'Download Calendar' || text === 'Subscribe') {
            const link = cell.querySelector('a');
            const href = link?.getAttribute('href') ?? null;

            if (!href) return null;

            if (text === 'Download Calendar') {
              return formatRefuseCalendarPDFUrl(href);
            }

            if (text === 'Subscribe') {
              refuseSubscribeUrl = href;
              return href;
            }
          }

          return text || null;
        });

        const identifier = getCollectionIdentifier(refuseSubscribeUrl);
        rowData.push(identifier);
        rowData.push(formatCollectionName(refuseSubscribeUrl));
        rowData.push(formatCollectionUrl(identifier, false));

        const rowObject = {};
        for (const [index, key] of refuseCollectionJsonKeys.entries()) {
          rowObject[key] = rowData[index] ?? null;
        }

        refuseCollectionData.push(rowObject);
      });
    }

    // 5. Parse garden waste table
    if (gardenRows.length > 0) {
      let gardenSubscribeUrl = null;

      gardenRows.forEach((row) => {
        const cells = row.removeWhitespace().querySelectorAll('td');
        const rowData = cells.map((cell) => {
          const text = cell.text?.trim() ?? '';

          if (text === 'Download Calendar' || text === 'Subscribe') {
            const link = cell.querySelector('a');
            const href = link?.getAttribute('href') ?? null;

            if (!href) return null;

            if (text === 'Download Calendar') {
              return formatGardenCalendarPDFUrl(href);
            }

            if (text === 'Subscribe') {
              gardenSubscribeUrl = href;
              return href;
            }
          }

          return text || null;
        });

        const identifier = getCollectionIdentifier(gardenSubscribeUrl);
        rowData.push(identifier);
        rowData.push(formatCollectionName(gardenSubscribeUrl));
        rowData.push(formatCollectionUrl(identifier, true));

        const rowObject = {};
        for (const [index, key] of gardenWasteCollectionJsonKeys.entries()) {
          rowObject[key] = rowData[index] ?? null;
        }

        gardenWasteCollectionData.push(rowObject);
      });
    }

    if (refuseCollectionData.length === 0 && gardenWasteCollectionData.length === 0) {
      return new Response(
        'The street name query did not return any bin collection data. Please check the street name entered is valid and within the Gedling Borough Council district and try again.',
        { status: 404 }
      );
    }

    const body = {
      streetNameQuery: streetName,
      refuseCollections: refuseCollectionData,
      gardenWasteCollections: gardenWasteCollectionData,
      viewState: searchPageFormData.__VIEWSTATE,
      viewStateGenerator: searchPageFormData.__VIEWSTATEGENERATOR ?? null,
      eventValidation: searchPageFormData.__EVENTVALIDATION ?? null,
    };

    return new Response(JSON.stringify(body), { 
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      } 
    });

  } catch (err) {
    console.error('Street search handler error:', err);
    return new Response('Internal error while processing street search.', {
      status: 500,
    });
  }
});

export default { 
  fetch(request, env, ctx) {
    return router.fetch(request, env, ctx) 
  }
}
