import { Injectable } from '@angular/core';
import { Http, Headers, RequestMethod, RequestOptionsArgs, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../../environments/environment';


@Injectable()
export class RestApiService {

  private rosetteUrl: string = environment.rosetteUrl + '/';

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  public read(path: string, params?: any): Observable<Response> {
    return this.makeRequest(true, RequestMethod.Get, path, params);
  }

  public create(path: string, params?: any, data?: any, headers?: Headers): Observable<Response> {
    return this.makeRequest(true, RequestMethod.Post, path, params, data, headers);
  }

  public update(path: string, params?: any, data?: any): Observable<Response> {
    return this.makeRequest(true, RequestMethod.Put, path, params, data);
  }

  public delete(path: string, params?: any): Observable<Response> {
    return this.makeRequest(true, RequestMethod.Delete, path, params);
  }

  public postNoAuth(path: string, params?: any, data?: any): Observable<Response> {
    return this.makeRequest(false, RequestMethod.Post, path, params, data);
  }

  public putNoAuth(path: string, params?: any, data?: any): Observable<Response> {
    return this.makeRequest(false, RequestMethod.Put, path, params, data);
  }

  /*
      let searchParams = params ? Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&') : undefined;
      let body = data ? JSON.stringify(data) : undefined;
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptionsArgs({
        headers: headers,
        search: new URLSearchParams(searchParams)
      });
      this.http.post(this.rosetteUrl + path, body, options)
        .map(res => res.json())
        .subscribe(
          data => data,
          error => console.log(error),
          () => console.log('Request Complete')
        );
  */

  private makeRequest(withAuth: boolean, method: RequestMethod, path: string, params?: any, data?: any, headers?: Headers): Observable<Response> | any {
    let searchParams: URLSearchParams = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach(key => searchParams.set(key, params[key]));
    }
    let body: string | FormData;
    if (data && data instanceof FormData) {
      body = data;
    } else {
      // Remove 'rawData' in stringify
      body = data ? JSON.stringify(data, (name, value) => name !== 'rawData' ? value : undefined) : '';
    }
    let options: RequestOptionsArgs = {
      method: method,
      headers: headers ? headers : new Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      search: searchParams,
      body: body
    };
    if (withAuth) {
      return this.authHttp.request(this.rosetteUrl + path, options);
    } else {
      return this.http.request(this.rosetteUrl + path, options);
    }
  }
}
