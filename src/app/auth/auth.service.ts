import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { RestApiService } from '../shared/server/rest-api.service';
import { RestApiError } from '../shared/server/rest-api-error.model';
import { UserIdentity, CurrentUserService } from '../shared/current-user.service';

@Injectable()
export class AuthService {

  private jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(
    private api: RestApiService,
    private currentUser: CurrentUserService,
  ) {
  }

  get userId(): number {
    return this.currentUser.userId;
  }

  get user(): UserIdentity {
    return this.currentUser.user;
  }

  public isAuthorized(): boolean {
    let token: string = localStorage.getItem('accessToken');
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      this.currentUser.setUser({
        id: this.jwtHelperService.decodeToken(token).sub,
        fullName: localStorage.getItem('userFullName'),
        email: localStorage.getItem('userEmail')
      });
      return true;
    }
    return false;
  }

  public signup(email: string, firstName: string, lastName: string, password: string, wantedPermissions: string, consentText: string): Observable<boolean> {
    return Observable.create(observer => {
      this.api.create('api/users/signup', {}, {
        email: email, firstName: firstName, lastName: lastName,
        password: password, description: wantedPermissions, consentText: consentText,
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
            this.currentUser.setUser(<UserIdentity>response.body);
            localStorage.setItem('userFullName', this.currentUser.user.fullName);
            localStorage.setItem('userEmail', this.currentUser.user.email);
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
