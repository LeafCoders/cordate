import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { TextValue, TextValueList } from './rest-api.model';

@Injectable()
export class TextValuesResource {

  private baseResource: BaseResource<TextValue, any>;
  private cachedTextValues: TextValueList = [];

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<TextValue, any>(apiError, undefined);
  }

  refreshCache(textValueToRefresh: TextValue): void {
    let index: number = this.cachedTextValues.findIndex(TextValue.idEquals(textValueToRefresh.id));
    if (index >= 0) {
      this.cachedTextValues[index] = textValueToRefresh;
    } else {
      this.cachedTextValues.push(textValueToRefresh);
    }
  }

  list(reload: boolean = false): Observable<TextValueList> {
    if (!reload && this.cachedTextValues.length) {
      return Observable.of(this.cachedTextValues);
    }
    return this.baseResource.handleError<TextValueList>(
      this.api.read('api/textValues', {})
        .map((data: Response): TextValueList => {
          this.cachedTextValues = data.json().map(item => new TextValue(item))
          return this.cachedTextValues;
        })
    );
  }

  listCached(): TextValueList {
    return this.cachedTextValues;
  }

  getCached(textValueId: number): TextValue {
    return this.cachedTextValues.find(TextValue.idEquals(textValueId));
  }

  create(textValue: TextValue): Observable<TextValue> {
    return this.baseResource.handleError<TextValue>(
      this.api.create('api/textValues', {}, textValue)
        .map((data: Response): TextValue => {
          return new TextValue(data.json());
        })
    );
  }

  update(textValueId: number, textValue: TextValue): Observable<TextValue> {
    return this.baseResource.handleError<TextValue>(
      this.api.update(`api/textValues/${textValueId}`, {}, textValue)
        .map((data: Response): TextValue => {
          return undefined; //new TextValue(data.json());
        })
    );
  }

  delete(textValueId: number): Observable<void> {
    return this.baseResource.handleError<any>(
      this.api.delete(`api/textValues/${textValueId}}`)
    );
  }

}