import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RestApiError } from './rest-api-error.model';
import { RestApiErrorService } from './rest-api-error.service';

export type RequestParams = HttpParams | { [param: string]: any | string[] };

@Injectable()
export class RestApiService {

  private rosetteUrl: string = environment.rosetteUrl;

  constructor(
    private httpClient: HttpClient,
    private apiErrorService: RestApiErrorService,
  ) {
  }

  public read<T>(path: string, params?: RequestParams): Observable<T> {
    return this.makeRequest<T>('GET', path, params);
  }

  public create<T>(path: string, params?: RequestParams, data?: any, headers?: HttpHeaders): Observable<T> {
    return this.makeRequest<T>('POST', path, params, data, headers);
  }

  public update<T>(path: string, params?: RequestParams, data?: any): Observable<T> {
    return this.makeRequest<T>('PUT', path, params, data);
  }

  public delete<T>(path: string, params?: RequestParams): Observable<T> {
    return this.makeRequest<T>('DELETE', path, params);
  }

  public createReturnResponse<T>(path: string, params?: RequestParams, data?: any): Observable<{} | HttpResponse<T>> {
    return this.makeRequestReturnResponse('POST', path, params, data);
  }

  public updateReturnResponse<T>(path: string, params?: RequestParams, data?: any): Observable<{} | HttpResponse<T>> {
    return this.makeRequestReturnResponse('PUT', path, params, data);
  }

  public createMultiPart(path: string, params: RequestParams, data: FormData): Observable<JSON> {
    return this.httpClient.request<JSON>('POST', this.rosetteUrl + path, {
      observe: 'response',
      responseType: 'json',
      headers: new HttpHeaders({ 'Accept': 'application/json', 'enctype': 'multipart/form-data' }),
      params: params,
      body: data
    })
      .pipe(
        catchError(e => this.handleError(e)),
        map((data: HttpResponse<JSON>) => data.body)
      );
  }

  private makeRequest<T>(method: string, path: string, params?: RequestParams, data?: any, headers?: HttpHeaders): Observable<T> {
    return this.makeRequestReturnResponse(method, path, params, data, headers).pipe(
      map((data: HttpResponse<T>) => data.body)
    );
  }

  private makeRequestReturnResponse<T>(method: string, path: string, params?: RequestParams, data?: any, headers?: HttpHeaders): Observable<{} | HttpResponse<T>> {
    // Remove 'rawData' in stringify
    let body = data ? JSON.stringify(data, (name, value) => name !== 'rawData' ? value : undefined) : '';

    return this.httpClient.request<T>(method, this.rosetteUrl + path, {
      observe: 'response',
      responseType: 'json',
      headers: headers ? headers : new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      params: params,
      body: body
    })
      .pipe(catchError(e => this.handleError(e)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = new RestApiError(error)
    this.apiErrorService.addApiError(apiError);
    return throwError(apiError);
  };
}
