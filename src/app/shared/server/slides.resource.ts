import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Slide, SlideShow } from './rest-api.model';

export interface SlideUpdate {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  imageId: number;
}

@Injectable()
export class SlidesResource extends DefaultBaseResource<Slide, SlideUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'slides');
  }

  newInstance(data?: any): Slide {
    let slide: Slide = new Slide(data ? data : {});
    slide.setParent(<SlideShow>this.parentItem);
    return slide;
  }

  updateInstance(from: Slide): SlideUpdate {
    return <SlideUpdate>{ id: from.id };
  }

}
