import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { RestApiService } from '../shared/server/rest-api.service';
import { AuthService } from './auth.service';

export interface PermissionResults {
  [key: string]: boolean;
};

@Injectable()
export class AuthPermissionService {

  private userPermissions: PermissionsChecker;

  constructor(private api: RestApiService, private auth: AuthService) { }

  // Multiple permissions should be divided with a ';'
  isPermitted(permissions: string): boolean {
    return this.userPermissions ? this.userPermissions.hasPermission(permissions) : false;
  }

  clearPermissions(): void {
    this.userPermissions = undefined;
    localStorage.removeItem('permissions');
  }

  readUserPermissions(): Promise<boolean> {
    const useFromLocalStorage: boolean = false;

    // Get previous permissions from local storage
    let fromStorage: string = localStorage.getItem('permissions');
    this.userPermissions = fromStorage ? new PermissionsChecker(fromStorage.split(';')) : undefined;

    // Get current permissions from server
    let userId: number = this.auth.userId;
    var promise = this.api.read(`api/users/${userId}/permissions`).map(data => data.json()).toPromise();
    promise = promise.then((permissions: any) => {
      this.userPermissions = new PermissionsChecker(permissions);
      localStorage.setItem('permissions', permissions.join(';'));
      return true;
    }).catch(() => {
      this.clearPermissions();
      return false;
    });
    return useFromLocalStorage && this.userPermissions ? Promise.resolve(true) : promise;
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