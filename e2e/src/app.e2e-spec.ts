import { CordatePage } from './app.po';

describe('cordate App', function() {
  let page: CordatePage;

  beforeEach(() => {
    page = new CordatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
