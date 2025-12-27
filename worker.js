import { Router, cors, json } from 'itty-router';
import puppeteer from "@cloudflare/puppeteer";
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

/**
 * New bin collection calendar address lookup
 * https://waste.digital.gedling.gov.uk/w/webpage/bin-collections
 */
router.get('/get-bin-collection-calendar', async (request, env, ctx) => {

  const addressQuery = request.query.address ?? null;

  if (!addressQuery) {
    return json({ error: 'No address search value was provided'}, { status: 400 });
  }

  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  const timeout = env.PUPPETEER_BROWSER_TIMEOUT ?? 30000;

  const searchInputSelector = 'input.relation_path_type_ahead_search';

  try {
    await Promise.all([
      page.goto(env.GEDLING_BIN_COLLECTIONS_SEARCH_URL, { timeout: timeout }),
      page.waitForSelector(searchInputSelector, { timeout: timeout }),
    ]);
  }
  catch (err) {
    return json({ error: `Failed to load Gedling Borough Council bin collections page: ${env.GEDLING_BIN_COLLECTIONS_SEARCH_URL}`}, { status: 500 });
  }

  await page.type(
    searchInputSelector, 
    addressQuery,
    { delay: 50 }
  );

  await page.waitForSelector('.relation_path_type_ahead_results_holder > ul', { timeout: timeout });
  await page.click('.relation_path_type_ahead_results_holder > ul > li:first-child');
  await page.click('input[value="View collection days"]');

  await page.waitForSelector('input[value="View 2025/2026 collection days"]',  { timeout: timeout });
  await page.click('input[value="View 2025/2026 collection days"]');

  function parseWidget(raw) {
    if (!raw) { 
      return json({ error: 'The data-params attribute could not be found'}, { status: 400 });
    }

    try {
      return JSON.parse(raw);
    } 
    catch {
      return json({ error: 'Invalid JSON was returned.'}, { status: 500 });
    }
  }

  async function extractWidget(page, selector) {
    await page.waitForSelector(selector, { timeout: timeout });

    const raw = await page.$eval(selector, el =>
      el.getAttribute('data-params')
    );

    return parseWidget(raw);
  }

  const addressDataSelector = '#mats_content_wrapper > div > form > div > div:nth-child(2) > div > div.page_cell.contains_widget.col-12.col-lg-8 > div > div';
  const widgetSelector = '#mats_content_wrapper > div > form > div > div:nth-child(3) > div > div';

  const addressWidgetData = await extractWidget(page, addressDataSelector);
  const collectionWidgetData = await extractWidget(page, widgetSelector);
  const collectionUrl = page.url();

  await page.close();

  const address = addressWidgetData?.template_data?.address ?? null;
  const collections = collectionWidgetData?.template_data?.collections ?? null;

  return json({
    addressQuery: addressQuery,
    address: address,
    binCollectionUrl: collectionUrl,
    collections: collections
  });
});

/**
 * Legacy street search endpoint
 * https://apps.gedling.gov.uk/refuse/search.aspx
 */
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

  const gedlingRefuseSearchUrl = env.GEDLING_LEGACY_REFUSE_SEARCH_URL;
  const baseUrl = env.BASE_URL;

  if (!gedlingRefuseSearchUrl || !baseUrl) {
    return new Response('Worker configuration error: missing GEDLING_LEGACY_REFUSE_SEARCH_URL and/or BASE_URL.', {
      status: 500,
    });
  }

  const appBaseUrl = new URL(gedlingRefuseSearchUrl).origin;

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

    return new URL(`/refuse/${path}`, appBaseUrl).toString();
  }

  function formatGardenCalendarPDFUrl(path) {
    if (!path) {
      return null;
    }

    return new URL(path, appBaseUrl).toString();
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

  const streetName = request.query.streetName ?? null;

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
    const searchPageResponse = await fetch(gedlingRefuseSearchUrl);

    if (!searchPageResponse.ok) {
      return new Response(
        `Failed to fetch ${gedlingRefuseSearchUrl}. HTTP error: ${searchPageResponse.status} ${searchPageResponse.statusText}.`,
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

    const formData = new FormData();

    for (const key in searchPageFormData) {
      if (searchPageFormData[key] != null) {
        formData.append(key, searchPageFormData[key]);
      }
    }

    formData.append('ctl00$MainContent$street', streetName);
    formData.append('ctl00$MainContent$mybutton', 'Search');

    const searchRequestResponse = await fetch(gedlingRefuseSearchUrl, {
      method: 'POST',
      body: formData,
    });

    if (!searchRequestResponse.ok) {
      return new Response(
        `Failed to post search to ${gedlingRefuseSearchUrl}. HTTP error: ${searchRequestResponse.status} ${searchRequestResponse.statusText}.`,
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

    if (refuseRows.length > 0) {
      let refuseSubscribeUrl = null;

      refuseRows.forEach((row) => {
        const cells = row.removeWhitespace().querySelectorAll('td');
        const rowData = cells.map((cell) => {
          const text = cell.text?.trim() ?? '';

          if (text === 'Download Calendar' || text === 'Subscribe') {
            const link = cell.querySelector('a');
            const href = link?.getAttribute('href') ?? null;

            if (!href) {
              return null;
            }

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

    return json(body);

  } 
  catch (err) {
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
