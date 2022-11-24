import * as fs from 'fs';
import urls from '../../main/modules/routes/urls';
import { config } from '../config';
import Axios from 'axios';
import puppeteer from 'puppeteer';
const pa11y = require('pa11y');

const screenshotDir = `${__dirname}/../../../functional-output/pa11y`;
const axios = Axios.create({ baseURL: config.TEST_URL });

function ensurePageCallWillSucceed(url: string): Promise<void> {
  return axios.get(url);
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function runPally(url: string, browser): Promise<Pa11yResult> {
  let screenCapture: string | boolean = false;
  if (!config.TestHeadlessBrowser) {
    screenCapture = `${screenshotDir}/${url.replace(/^\/$/, 'home').replace('/', '')}.png`;
  }

  const fullUrl = `${config.TEST_URL}${url}`;
  return pa11y(fullUrl, {
    browser,
    screenCapture,
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
  });
}

jest.retryTimes(3);
jest.setTimeout(15000);

describe('Accessibility', () => {
  let browser;
  let hasAfterAllRun = false;

  const setup = async () => {
    if (hasAfterAllRun) {
      return;
    }
    if (browser) {
      await browser.close();
    }
    if (!config.TestHeadlessBrowser) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    browser.on('disconnected', setup);
  };

  beforeAll(setup);

  afterAll(async () => {
    hasAfterAllRun = true;
    await browser.close();
  });

  const urlsToTest = Object.values(urls);
  describe.each(urlsToTest)('Page %s', url => {
    test('should have no accessibility errors', async () => {
      await ensurePageCallWillSucceed(url);
      const result = await runPally(url, browser);
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    });
  });
});

interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];
}

interface PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}
