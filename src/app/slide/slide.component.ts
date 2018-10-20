import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';
import { SlidesResource } from '../shared/server/slides.resource';
import { Slide, SlideShow, SlideShowList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-slide',
  templateUrl: './slide.component.html'
})
export class SlideComponent extends BaseContainer<Slide> {

  slideShows: SlideShowList;
  selectedSlideShow: SlideShow;

  constructor(
    private slidesResource: SlidesResource,
    private slideShowsResource: SlideShowsResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(slidesResource, router, route);
  }

  protected init(): void {
    this.slideShowsResource.list().subscribe((slideShows: SlideShowList) => {
      this.slideShows = slideShows;
      this.selectedSlideShow = slideShows[0];
      this.updateCreataPermission();
    });
  }

  selectSlideShow(slideShow: SlideShow): void {
    this.selectedSlideShow = slideShow;
    this.updateCreataPermission();
  }

  private updateCreataPermission(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.slidesResource.createPermission(this.selectedSlideShow));
  }
}
