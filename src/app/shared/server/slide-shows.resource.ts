import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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

/*
  private up(cache: Array<Slide>, toUpdate: Slide, idComparatorFn: IdComparator, sortFn: SortFunction): void {
    let index: number = cache.findIndex(idComparatorFn);
    if (index >= 0) {
      cache[index] = toUpdate;
    } else {
      index = cache.findIndex(sortFn);
      if (index >= 0) {
        cache.splice(index, 0, toUpdate);
      } else {
        cache.push(toUpdate);
      }
    }
  }
*/
/*
  list(reload: boolean = false): Observable<SlideShowList> {
    if (!reload && this.cachedSlideShows.length) {
      return Observable.of(this.cachedSlideShows);
    }
    return this.baseResource.handleError<SlideShowList>(
      this.api.read('api/slideShows')
        .map((data: Response): SlideShowList => {
          this.cachedSlideShows = data.json().map(item => new SlideShow(item))
          return this.cachedSlideShows;
        })
    );
  }

  listCached(): SlideShowList {
    return this.cachedSlideShows;
  }

  getCached(slideShowId: number): SlideShow {
    return this.cachedSlideShows.find(SlideShow.idEquals(slideShowId));
  }

  create(slideShow: SlideShow): Observable<SlideShow> {
    return this.baseResource.handleError<SlideShow>(
      this.api.create('api/slideShows', {}, slideShow)
        .map((data: Response): SlideShow => {
          return new SlideShow(data.json());
        })
    );
  }

  update(slideShow: SlideShow): Observable<SlideShow> {
    return this.baseResource.handleError<SlideShow>(
      this.api.update(`api/slideShows/${slideShow.id}`, {}, slideShow)
        .map((data: Response): SlideShow => {
          return undefined; //new SlideShow(data.json());
        })
    );
  }
*/




/*
  createSlide(slideShow: SlideShow, slide: Slide): Observable<Slide> {
    return this.baseResource.handleError<Slide>(
      this.api.create(`api/slideShows/${slideShow.id}/slides`, {}, slide)
        .map((data: Response): Slide => {
          return new Slide(slideShow, data.json());
        })
    );
  }

  updateSlide(slideShow: SlideShow, slideId: number, slide: Slide): Observable<Slide> {
    return this.baseResource.handleError<Slide>(
      this.api.update(`api/slideShows/${slideShow.id}/slides/${slideId}`, {}, slide)
        .map((data: Response): Slide => {
          return undefined; //new Slide(data.json());
        })
    );
  }
*/
}