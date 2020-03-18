import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { BaseList } from '../shared/base/base-list';
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
  activeSlides: Array<Slide> = [];
  passedSlides: Array<Slide> = [];

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
    const toSlide: Slide = this.activeSlides[event.currentIndex];
    if (moveSlide === toSlide) {
      return;
    }

    // Perform move at server
    this.slidesResource.moveSlide(moveSlide, toSlide.id).subscribe();

    // Perform move at client (until updated slides are returned from server)
    moveItemByDisplayOrder(this.activeSlides, moveSlide, toSlide);
    this.activeSlides.sort((a, b) => a.displayOrder > b.displayOrder ? -1 : 1);
  }

  private groupSlides(slides: SlideList): void {
    this.activeSlides = slides.filter(s => !s.isAfterActive()).sort((a, b) => a.displayOrder > b.displayOrder ? -1 : 1);
    this.passedSlides = slides.filter(s => s.isAfterActive()).sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1);
  }
}
