import { CordatePage } from './app.po';
import { browser, logging } from 'protractor';

describe('cordate App', function () {
  let page: CordatePage;

  beforeEach(() => {
    page = new CordatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('app works!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
