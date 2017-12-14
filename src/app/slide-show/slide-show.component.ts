import { Component, OnInit } from '@angular/core';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';
import { SlideShow } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-slide-show',
  templateUrl: './slide-show.component.html'
})
export class SlideShowComponent extends BaseContainer<SlideShow> {

  constructor(
    private slideShowsResource: SlideShowsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(slideShowsResource);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.slideShowsResource.createPermission());
  }
}
