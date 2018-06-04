import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

import { RestApiService } from '../shared/server/rest-api.service';
import { RestApiError } from '../shared/server/rest-api-error.model';

export interface UserIdentity {
  id: number;
  fullName: string;
  email: string;
};


@Injectable()
export class AuthService {

  private jwtHelperService: JwtHelperService = new JwtHelperService();
  private currentUser: UserIdentity;

  constructor(private api: RestApiService) {
  }

  get userId(): number {
    return this.currentUser ? this.currentUser.id : undefined;
  }

  get user(): UserIdentity {
    return this.currentUser ? this.currentUser : { id: undefined, fullName: '-', email: '-' };
  }

  public isAuthorized(): boolean {
    let token: string = localStorage.getItem('accessToken');
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      this.currentUser = {
        id: this.jwtHelperService.decodeToken(token).sub,
        fullName: localStorage.getItem('userFullName'),
        email: localStorage.getItem('userEmail')
      };
      return true;
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

  public login(username: string, password: string): Observable<UserIdentity> {
    return Observable.create(observer => {
      this.api.createReturnResponse<UserIdentity>('auth/login', {}, { username: username, password: password })
        .subscribe(
          (response: HttpResponse<any>) => {
            localStorage.setItem('accessToken', response.headers.get('X-AUTH-TOKEN'));
            this.currentUser = <UserIdentity>response.body;
            localStorage.setItem('userFullName', this.currentUser.fullName);
            localStorage.setItem('userEmail', this.currentUser.email);
            observer.next(this.currentUser);
          },
          (error: RestApiError) => {
            observer.error(error);
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
      this.api.updateReturnResponse('auth/forgottenPassword', { token: token, password: password })
        .subscribe(
          response => observer.next(true),
          error => observer.next(false),
          () => observer.complete()
        );
    });
  }
}
