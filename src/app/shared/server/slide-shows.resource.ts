import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
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
    apiError: RestApiErrorService,
  ) {
    super(api, 'slideShows', apiError);
  }

  newInstance(data?: any): SlideShow {
    return new SlideShow(data ? data : {});
  }

  updateInstance(from: SlideShow): SlideShowUpdate {
    return <SlideShowUpdate>{ id: from.id };
  }

}