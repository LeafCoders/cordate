import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { AuthPermissionService } from './auth/auth-permission.service';
import { SignalService } from './shared/signal.service';

interface LinkItem {
  permission: string;
  title: string;
  routePath: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(MatSidenav)
  private sideNav: MatSidenav;
  private links: Array<LinkItem> = [
    { permission: 'events', title: 'Händelser', routePath: '/events' },
    { permission: 'slideShows', title: 'Bildspel', routePath: '/slideShows' },
    { permission: 'slides', title: 'Bildspel', routePath: '/slides' },
    { permission: 'textValues', title: 'Textvärden', routePath: '/textValues' },
    { permission: 'uploads', title: 'Filer', routePath: '/uploads' },
    { permission: 'assetFolders', title: 'Filkataloger', routePath: '/assetFolders' },
    { permission: 'sermons', title: 'Predikningar', routePath: '/sermons' },
    { permission: 'sermonSeries', title: 'Predikoserier', routePath: '/sermonSeries' },
    { permission: 'users', title: 'Användare', routePath: '/users' },
    { permission: 'groups', title: 'Grupper', routePath: '/groups' },
    { permission: 'permissions', title: 'Rättigheter', routePath: '/permissions' },
    { permission: 'podcasts', title: 'Podcasts', routePath: '/podcasts' },
    { permission: 'resources', title: 'Resurser', routePath: '/resources' },
    { permission: 'resourceTypes', title: 'Resurstyper', routePath: '/resourceTypes' },
    { permission: 'eventTypes', title: 'Händelsetyper', routePath: '/eventTypes' },
    { permission: undefined, title: 'Logga ut', routePath: '/auth/login' },
  ];

  visibleLinks: Array<LinkItem> = [];

  constructor(
    signalService: SignalService,
    authPermission: AuthPermissionService,
  ) {
    signalService.openSideNavRequested$.subscribe(() => {
      this.visibleLinks = this.links.filter((link: LinkItem): boolean => {
        if (link.permission) {
          return authPermission.isPermitted(`${link.permission}:view`);
        }
        return true;
      });
      this.sideNav.open();
    });
  }

  ngOnInit() {
    window.addEventListener("dragover", (event: Event) => event.preventDefault(), false);
    window.addEventListener("drop", (event: Event) => event.preventDefault(), false);
  }

  closeNav(): void {
    this.sideNav.close();
  }
}
