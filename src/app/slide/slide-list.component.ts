import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { BaseList } from '../shared/base/base-list';
import { ItemsGroup, itemsGrouper } from '../shared/items-grouper';
import { Slide, SlideList, SlideShow } from '../shared/server/rest-api.model';
import { SlidesResource } from '../shared/server/slides.resource';
import { moveItemByDisplayOrder } from '../shared/util/display-order';

@Component({
  selector: 'lc-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent extends BaseList<Slide> {

  currentSlideShow: SlideShow;
  slideGroups: Array<ItemsGroup<Slide>> = [{ title: 'Kommer att visas eller visas nu', items: [] }, { title: 'Visas inte längre', items: [] }];

  constructor(
    private slidesResource: SlidesResource,
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

  public slideDrop(event: CdkDragDrop<Slide, Slide>): void {
    const moveSlide: Slide = event.item.data;
    const toSlide: Slide = this.slideGroups[0].items[event.currentIndex];

    // Perform move at server
    this.slidesResource.moveSlide(moveSlide, toSlide.id).subscribe();

    // Perform move at client (until updated slides are returned from server)
    moveItemByDisplayOrder(this.slideGroups[0].items, moveSlide, toSlide);
  }

  private groupSlides(slides: SlideList): void {
    let groups = itemsGrouper<Slide>(
      (item: Slide) => (item.endTime && item.endTime.isBefore()) ? 1 : 0,
      (item: Slide) => {
        return {
          title: undefined,
          data: undefined,
          items: []
        };
      },
      (item: Slide) => item,
      slides
    );
    this.slideGroups[0].items = groups[0] ? groups[0].items.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1) : [];
    this.slideGroups[1].items = groups[1] ? groups[1].items : [];
  }
}
