import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { EducationTheme, EducationThemeList, Event } from './rest-api.model';

@Injectable()
export class EducationThemesResource {

  private baseResource: BaseResource<EducationTheme, any>;
  private cachedEducationThemes: EducationThemeList = [];

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<EducationTheme, any>(apiError, undefined);
  }

  list(reload: boolean = false): Observable<EducationThemeList> {
    if (!reload && this.cachedEducationThemes.length) {
      return Observable.of(this.cachedEducationThemes);
    }
    return this.baseResource.handleError<EducationThemeList>(
      this.api.read(`api/educationThemes`)
        .map((data: Response): EducationThemeList => {
          this.cachedEducationThemes = data.json().map(item => new EducationTheme(item))
          return this.cachedEducationThemes;
        })
    );
  }
}