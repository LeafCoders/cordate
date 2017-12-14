import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { Education, EducationList, Event } from './rest-api.model';
import * as moment from 'moment';

@Injectable()
export class EducationsResource {

  private baseResource: BaseResource<Education, any>;
  private cachedEducations: EducationList = [];

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<Education, any>(apiError, undefined);
  }

  /*
    refreshCache(educationToRefresh: Education): void {
      let index: number = this.cachedEducations.findIndex(Education.idEquals(educationToRefresh.id));
      if (index >= 0) {
        this.cachedEducations[index] = educationToRefresh;
      } else {
        let index: number = this.cachedEducations.findIndex((Education: Education) => Education.startTime.isAfter(educationToRefresh.startTime));
        if (index >= 0) {
          this.cachedEducations.splice(index, 0, educationToRefresh);
        } else {
          this.cachedEducations.push(educationToRefresh);
        }
      }
    }
  */
  /*
    list(reload: boolean = false): Observable<EducationList> {
      if (!reload && this.cachedEducations.length) {
        return Observable.of(this.cachedEducations);
      }
      return this.baseResource.handleError<EducationList>(
        this.api.read(`api/educations`, { from: moment().format('YYYY-MM-DD') })
          .map((data: Response): EducationList => {
            this.cachedEducations = data.json().map(item => new Education(item))
            return this.cachedEducations;
          })
      );
    }
  */
  listForEvent(event: Event): Observable<EducationList> {
    return this.baseResource.handleError<EducationList>(
      this.api.read(`api/educations`, { eventId: event.id })
        .map((data: Response): EducationList => {
          return data.json().map(item => new Education(item))
        })
    );
  }

  /*
    listCached(): EducationList {
      return this.cachedEducations;
    }

    getCached(educationId: number): Education {
      return this.cachedEducations.find(Education.idEquals(educationId));
    }
  */

  create(education: Education): Observable<Education> {
    return this.baseResource.handleError<Education>(
      this.api.create('api/educations', {}, education)
        .map((data: Response): Education => {
          return new Education(data.json());
        })
    );
  }

  update(educationId: number, education: Education): Observable<Education> {
    return this.baseResource.handleError<Education>(
      this.api.update(`api/educations/${educationId}`, {}, education)
        .map((data: Response): Education => {
          return undefined; //new Education(data.json());
        })
    );
  }

  delete(education: Education): Observable<Response> {
    return this.baseResource.handleError<Response>(
      this.api.delete(`api/educations/${education.id}`)
    );
  }
}