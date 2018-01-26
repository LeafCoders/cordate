import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { RestApiService } from '../shared/server/rest-api.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

export interface PermissionResults {
  [key: string]: boolean;
};

@Injectable()
export class AuthPermissionService {

  private userPermissions: PermissionsChecker;
  private hasLoadedFromServer: boolean = false;

  constructor(private api: RestApiService, private auth: AuthService) { }

  // Multiple permissions should be divided with a ';'
  isPermitted(permissions: string): boolean {
    return this.userPermissions ? this.userPermissions.hasPermission(permissions) : false;
  }

  // Multiple permissions should be divided with a ';'
  loadAndCheckPermission(permissions: string): Observable<boolean> {
    // Get previous permissions from local storage
    const fromStorage: string = localStorage.getItem(this.storageKey());
    this.userPermissions = fromStorage ? new PermissionsChecker(fromStorage.split(';')) : undefined;
    if (this.userPermissions && this.userPermissions.hasPermission(permissions)) {
      if (!this.hasLoadedFromServer) {
        this.hasLoadedFromServer = true;
        this.getPermissionsFromServer().subscribe();
      }
      return Observable.of<boolean>(true);
    }

    // Get current permissions from server
    const userId: number = this.auth.userId;
    return Observable.create(observer => {
      this.getPermissionsFromServer().subscribe(
        permissionsFromServer => {
          this.userPermissions = permissionsFromServer;
          observer.next(this.userPermissions.hasPermission(permissions));
        },
        error => {
          this.clearPermissions();
          observer.next(false);
        },
        () => observer.complete()
      );
    });
  }

  clearPermissions(): void {
    this.userPermissions = undefined;
    this.hasLoadedFromServer = false;
  }

  private getPermissionsFromServer(): Observable<PermissionsChecker> {
    const userId: number = this.auth.userId;
    return this.api.read(`api/users/${userId}/permissions`)
      .map(data => data.json())
      .map(permissionsFromServer => {
        const permissions = new PermissionsChecker(permissionsFromServer);
        localStorage.setItem(this.storageKey(), permissionsFromServer.join(';'));
        return permissions;
      });
  }

  private storageKey(): string {
    return `permissions-${this.auth.userId}`;
  }

}

class PermissionsChecker {
  private testedPermissions = {};

  constructor(private userPermissions: Array<string>) { }

  hasPermission(permissionsToTest: string): boolean {
    return permissionsToTest && permissionsToTest.split(';').some((testPermission, index, array) => {
      if (this.testedPermissions[testPermission] !== undefined) {
        return this.testedPermissions[testPermission];
      }

      let testParts: Array<string> = testPermission.split(':');
      let isPermitted = this.userPermissions.some((userPermission, index, array) => {
        let userParts: Array<string> = userPermission.split(':');
        if (userParts.length > testParts.length) {
          return false;
        }
        for (let i = 0; i < userParts.length; i++) {
          if (!this.comparePermissionPart(userParts[i], testParts[i])) {
            return false;
          }
        }
        return true;
      });
      if (testParts.length < 3) {
        this.testedPermissions[testPermission] = isPermitted;
      }
      return isPermitted;
    });
  };

  private comparePermissionPart(userPart, testPart) {
    if (userPart === '*' || testPart === '*') {
      return true;
    }

    return userPart.split(',').some((userPartPart) => {
      return testPart.split(',').some((testPartPart) => {
        return userPartPart === testPartPart;
      });
    });
  };

}