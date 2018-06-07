import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlidesResource } from '../shared/server/slides.resource';
import { Slide, SlideList, SlideShow } from '../shared/server/rest-api.model';
import { itemsGrouper, ItemsGroup } from '../shared/items-grouper';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';

@Component({
  selector: 'lc-slide-list',
  templateUrl: './slide-list.component.html'
})
export class SlideListComponent extends BaseList<Slide> {

  currentSlideShow: SlideShow;
  slideGroups: Array<ItemsGroup<Slide>> = [];

  constructor(
    private slidesResource: SlidesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(slidesResource);
  }

  protected init(): void {
    this.slidesResource.list().subscribe((slides: SlideList) => {
      this.groupSlides(slides);
    });
  }

  @Input('slideShow')
  set slideShow(slideShow: SlideShow) {
    this.currentSlideShow = slideShow;
    this.slidesResource.setParent('slideShows', slideShow);
  }

  private groupSlides(slides: SlideList): void {
    this.slideGroups = itemsGrouper<Slide>(
      (item: Slide) => (item.endTime && item.endTime.isBefore()) ? 2 : (item.startTime.isAfter() ? 0 : 1),
      (item: Slide) => {
        return {
          title: (item.endTime && item.endTime.isBefore()) ? 'Visas inte längre' : (item.startTime.isAfter() ? 'Kommer att visas senare' : 'Visas nu'),
          data: undefined,
          items: []
        };
      },
      (item: Slide) => item,
      slides
    );
  }
}
