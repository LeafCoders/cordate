import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, SlideShow, Slide } from './rest-api.model';

export interface SlideShowUpdate {
  id: number;
  idAlias: string;
  name: string;
  assetFolderId: number;
}

@Injectable()
export class SlideShowsResource extends DefaultBaseResource<SlideShow, SlideShowUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'slideShows');
  }

  newInstance(data?: any): SlideShow {
    return new SlideShow(data ? data : {});
  }

  updateInstance(from: SlideShow): SlideShowUpdate {
    return <SlideShowUpdate>{ id: from.id };
  }

}