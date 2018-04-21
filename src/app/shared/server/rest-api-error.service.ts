import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { RestApiError } from './rest-api-error.model';

@Injectable()
export class RestApiErrorService {

  private latestError: RestApiError;
  private errorSubject: Subject<RestApiError>;

  constructor() {
    this.errorSubject = new Subject<RestApiError>();
  }

  addApiError(apiError: RestApiError): void {
    this.latestError = apiError;
    this.errorSubject.next(this.latestError);
  }

  subject(): Subject<RestApiError> {
    return this.errorSubject;
  }
}
