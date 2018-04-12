import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

import { RestApiService } from '../shared/server/rest-api.service';
import { RestApiError } from '../shared/server/rest-api-error.model';

@Injectable()
export class AuthService {

  private jwtHelperService: JwtHelperService = new JwtHelperService();
  userId: number = 0;

  constructor(private api: RestApiService) {
  }

  public isAuthorized(): boolean {
    let token: string = localStorage.getItem('accessToken');
    if (token) {
      this.userId = this.jwtHelperService.decodeToken(token).sub;
      return !this.jwtHelperService.isTokenExpired(token);
    }
    return false;
  }

  public signup(email: string, firstName: string, lastName: string, password: string, wantedPermissions: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.create('api/signupUsers', {}, {
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
      this.api.createReturnResponse('auth/login', {}, { username: username, password: password })
        .subscribe(
          (response: HttpResponse<any>) => {
            localStorage.setItem('accessToken', response.headers.get('X-AUTH-TOKEN'));
            observer.next(response.body);
          },
          (error: HttpResponse<any>) => {
            observer.error(new RestApiError(error.body));
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
      this.api.create('auth/forgottenPassword', { email: email })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }

  public applyForgottenPassword(token: string, password: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.updateReturnResponse('auth/forgottenPassword', { token: token, password: btoa(password) })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }
}
