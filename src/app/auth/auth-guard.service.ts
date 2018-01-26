import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthPermissionService } from './auth-permission.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private authPermission: AuthPermissionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if (this.auth.isAuthorized()) {
      let permission: string;
      switch (route.url[0].path) {
        //        case '': return true;
        case 'mypages': permission = '*:view'; break;
        case 'articles': permission = 'articles:view'; break;
        case 'articleSeries': permission = 'articleSeries:view'; break;
        case 'articleTypes': permission = 'articleTypes:view'; break;
        case 'assets': permission = 'assets:view'; break;
        case 'assetFolders': permission = 'assetFolders:view'; break;
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
        case 'users': permission = 'users:view'; break;
        default:
          alert('Missing permissions for url path: ' + route.url[0].path);
          break;
      }

      return this.authPermission.loadAndCheckPermission(permission).map(permitted => {
        if (permission) {
          if (!permitted) {
            this.router.navigate(['/auth/login']);
          }
        } else {
          this.router.navigate(['/mypages']);
        }
        return permitted;
      });
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}