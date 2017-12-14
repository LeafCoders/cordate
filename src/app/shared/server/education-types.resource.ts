import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { EducationType, EducationTypeList, Event } from './rest-api.model';

@Injectable()
export class EducationTypesResource {

  private baseResource: BaseResource<EducationType, any>;
  private cachedEducationTypes: EducationTypeList = [];

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<EducationType, any>(apiError, undefined);
  }

  list(reload: boolean = false): Observable<EducationTypeList> {
    // TODO: Until rewritten
    return Observable.of(this.cachedEducationTypes);
    /*
    if (!reload && this.cachedEducationTypes.length) {
      return Observable.of(this.cachedEducationTypes);
    }
    return this.baseResource.handleError<EducationTypeList>(
      this.api.read(`api/educationTypes`)
        .map((data: Response): EducationTypeList => {
          this.cachedEducationTypes = data.json().map(item => new EducationType(item))
          return this.cachedEducationTypes;
        })
    );
    */
  }

  getCached(educationTypeId: number): EducationType {
    return this.cachedEducationTypes.find(EducationType.idEquals(educationTypeId));
  }

  educationTypeForEvent(event: Event): EducationType {
    return this.cachedEducationTypes.find((educationType: EducationType) => event.eventType.idEquals(educationType.eventType));
  }
}