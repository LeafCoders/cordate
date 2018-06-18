import { Injectable } from '@angular/core';
import * as moment from 'moment';

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
    let slide: Slide = new Slide(data ? data : {
      startTime: moment().hour(7).minute(0).second(0).millisecond(0).toJSON(),
      endTime: moment().hour(22).minute(0).second(0).millisecond(0).add(1, 'month').toJSON(),
      duration: 8,
    });
    slide.setParent(<SlideShow>this.parentItem);
    return slide;
  }

  updateInstance(from: Slide): SlideUpdate {
    if (from.id) {
      return <SlideUpdate>{ id: from.id };
    } else {
      return <SlideUpdate>{
        startTime: from.startTime.toJSON(),
        endTime: from.endTime.toJSON(),
        duration: from.duration,
      };
    }
  }

}
