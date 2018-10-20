import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';
import { SlideShow } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-slide-show-list',
  templateUrl: './slide-show-list.component.html'
})
export class SlideShowListComponent extends BaseList<SlideShow> {

  constructor(
    slideShowsResource: SlideShowsResource,
  ) {
    super(slideShowsResource, () => slideShowsResource.list());
  }

  protected init(): void {
  }

}
