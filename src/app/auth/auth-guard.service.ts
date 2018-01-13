import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthPermissionService } from './auth-permission.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private authPermission: AuthPermissionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> {
    if (this.auth.isAuthorized()) {
      let permission: string;
      switch (route.routeConfig.path) {
        //        case '': return true;
        case 'mypages': permission = '*:view'; break;
        case 'sermons': permission = 'articles:view'; break;
        case 'sermonSeries': permission = 'articleSeries:view'; break;
        case 'assetFolders': permission = 'assetFoldes:view'; break;
        case 'assetFolders': permission = 'assetFoldes:view'; break;
        case 'events': permission = 'events:view'; break;
        case 'eventTypes': permission = 'eventTypes:view'; break;
        case 'groups': permission = 'groups:view'; break;
        case 'permissions': permission = 'permissions:view'; break;
        case 'podcasts': permission = 'podcasts:view'; break;
        case 'resources': permission = 'resources:view'; break;
        case 'resourceTypes': permission = 'resourceTypes:view'; break;
        case 'slideShows': permission = 'slideShows:view'; break;
        case 'slides': permission = 'slides:view'; break;
        case 'textValues': permission = 'textValues:view'; break;
        case 'uploads': permission = 'uploads:view'; break;
        case 'users': permission = 'users:view'; break;
        default:
          alert('Missing permissions for url path: ' + route.routeConfig.path);
          break;
      }
      return this.authPermission.readUserPermissions().then(() => {
        if (permission) {
          if (this.authPermission.isPermitted(permission)) {
            return true;
          }
          this.router.navigate(['/auth/login']);
          return false;
        } else {
          this.router.navigate(['/mypages']);
          return false;
        }
      });
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}