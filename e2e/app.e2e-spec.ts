import { EordatePage } from './app.po';

describe('eordate App', function() {
  let page: EordatePage;

  beforeEach(() => {
    page = new EordatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
