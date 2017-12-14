import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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

  addError(errorResponse: Response): RestApiError {
    this.latestError = new RestApiError(errorResponse);
    this.errorSubject.next(this.latestError);
    return this.latestError;
  }

  subject(): Subject<RestApiError> {
    return this.errorSubject;
  }
}
