import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RestApiError } from './rest-api-error.model';

@Injectable()
export class RestApiErrorService {

  private latestError: RestApiError;
  private errorSubject: Subject<RestApiError>;

  constructor() {
    this.errorSubject = new Subject<RestApiError>();
  }

  addError(errorResponse: HttpResponse<any>): RestApiError {
    this.latestError = new RestApiError(errorResponse);
    this.errorSubject.next(this.latestError);
    return this.latestError;
  }

  subject(): Subject<RestApiError> {
    return this.errorSubject;
  }
}
