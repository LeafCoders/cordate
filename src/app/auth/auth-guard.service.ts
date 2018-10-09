import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthPermissionService } from './auth-permission.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  private failedLastCheck: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private authPermission: AuthPermissionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if (!this.auth.isAuthorized()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!route.url || route.url.length === 0) {
      this.router.navigate(['/events']);
      return false;
    }

    let permission: string;
    switch (route.url[0].path) {
      case 'mypages': permission = '*:view'; break;
      default:
        permission = `${route.url[0].path}:view`;
    }

    return this.authPermission.loadAndCheckPermission(permission).pipe(map(permitted => {
      if (!permitted) {
        if (this.failedLastCheck) {
          this.router.navigate(['/auth/login']);
          console.log("auth/login?error");
        } else {
          this.router.navigate(['/mypages']);
          console.log("mypages");
        }
      }
      this.failedLastCheck = !permitted;
      return permitted;
    }));
  }
}