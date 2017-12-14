import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';
import { SlideShow, SlideShowList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-slide-show-list',
  templateUrl: './slide-show-list.component.html'
})
export class SlideShowListComponent extends BaseList<SlideShow> {

  constructor(
    private slideShowsResource: SlideShowsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(slideShowsResource, () => slideShowsResource.list());
  }

  protected init(): void {
  }

}
