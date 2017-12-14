import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { RestApiService } from '../shared/server/rest-api.service';
import { RestApiError } from '../shared/server/rest-api-error.model';

@Injectable()
export class AuthService {

  private rosetteUrl: string = 'http://localhost:9000/';
  userId: number = 0;

  constructor(private api: RestApiService) {
  }

  public isAuthorized(): boolean {
    let token: string = localStorage.getItem('accessToken');
    if (token) {
      this.userId = new JwtHelper().decodeToken(token).sub;
      return tokenNotExpired(null, token);
    }
    return false;
  }

  public signup(email: string, firstName: string, lastName: string, password: string, wantedPermissions: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.postNoAuth('api/signupUsers', {}, {
        email: email, firstName: firstName, lastName: lastName,
        password: password, permissions: wantedPermissions
      })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }

  public login(username: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.api.postNoAuth('auth/login', {}, { username: username, password: password })
        .subscribe(
          (response: Response) => {
            localStorage.setItem('accessToken', response.headers.get('X-AUTH-TOKEN'));
            observer.next(response.json());
          },
          (error: Response) => {
            observer.error(new RestApiError(error));
          },
          () => observer.complete()
        );
    });
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
  }

  public createForgottenPassword(email: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.postNoAuth('auth/forgottenPassword', { email: email })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }

  public applyForgottenPassword(token: string, password: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.putNoAuth('auth/forgottenPassword', { token: token, password: btoa(password) })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }
}
