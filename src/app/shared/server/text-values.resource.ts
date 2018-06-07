import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { BaseResource } from './base.resource';
import { TextValue, TextValueList } from './rest-api.model';

@Injectable()
export class TextValuesResource {

  private baseResource: BaseResource<TextValue, any>;
  private cachedTextValues: TextValueList = [];

  constructor(
    private api: RestApiService,
  ) {
    this.baseResource = new BaseResource<TextValue, any>(undefined);
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
      return of(this.cachedTextValues);
    }
    return this.api.read<any[]>('api/textValues', {}).pipe(
      map((data): TextValueList => {
        this.cachedTextValues = data.map(item => new TextValue(item))
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
    return this.api.create<Object>('api/textValues', {}, textValue).pipe(
      map((data): TextValue => {
        return new TextValue(data);
      })
    );
  }

  update(textValueId: number, textValue: TextValue): Observable<TextValue> {
    return this.api.update(`api/textValues/${textValueId}`, {}, textValue).pipe(
      map((data): TextValue => {
        return undefined; //new TextValue(data.json());
      })
    );
  }

  delete(textValueId: number): Observable<void> {
    return this.api.delete(`api/textValues/${textValueId}}`);
  }

}