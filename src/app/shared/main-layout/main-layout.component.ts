import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../environments/environment';
import { ArticleTypeList } from '../server/rest-api.model';
import { SignalService } from '../signal.service';
import { RestApiError } from '../../shared/server/rest-api-error.model';
import { RestApiErrorService } from '../../shared/server/rest-api-error.service';
import { AuthPermissionService } from '../../auth/auth-permission.service';
import { ArticleTypesResource } from '../server/article-types.resource';

interface LinkItem {
  permission: string;
  title: string;
  routePath: string;
}

@Component({
  selector: 'lc-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  applicationName: string = environment.applicationName;

  private links: Array<LinkItem> = [
    { permission: 'events', title: 'Händelser', routePath: '/events' },
    { permission: 'slideShows', title: 'Bildspel', routePath: '/slideShows' },
    { permission: 'slides', title: 'Bildspel', routePath: '/slides' },
    { permission: 'textValues', title: 'Textvärden', routePath: '/textValues' },
    { permission: 'articleTypes', title: 'Artikeltyper', routePath: '/articleTypes' },
    { permission: 'assets', title: 'Filer', routePath: '/assets' },
    { permission: 'assetFolders', title: 'Filkataloger', routePath: '/assetFolders' },
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
  sideModeQuery: MediaQueryList;
  private subscription: Subscription;

  @ViewChild(MatSidenav)
  private sideNav: MatSidenav;

  constructor(
    public router: Router,
    private signalService: SignalService,
    private snackBar: MatSnackBar,
    private apiError: RestApiErrorService,
    private authPermission: AuthPermissionService,
    mediaMatcher: MediaMatcher,
    articleTypesResource: ArticleTypesResource,
  ) {
    this.sideModeQuery = mediaMatcher.matchMedia('(min-width: 112rem)');

    signalService.openSideNavRequested$.subscribe(() => {
      this.setupLinks();
      this.sideNav.open();
    });

    // TODO: This must be done after authorization
    let subscription = articleTypesResource.list().subscribe((articleTypes: ArticleTypeList) => {
      articleTypes.forEach(at => this.links.push({
        permission: at.idAlias, title: at.articleSeriesTitle, routePath: `/articleSeries/${at.idAlias}`
      }));
      articleTypes.forEach(at => this.links.push({
        permission: at.idAlias, title: at.articlesTitle, routePath: `/articles/${at.idAlias}`
      }));
    });
  }

  ngOnInit() {
    this.subscription = this.apiError.subject().subscribe(this.showError.bind(this));
    this.setupLinks();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  toggleNav(): void {
    if (this.sideNav.opened) {
      this.closeNav();
    } else {
      this.signalService.requestOpenSideNav();
    }
  }

  closeNav(): void {
    if (!this.sideModeQuery.matches) {
      this.sideNav.close();
    }
  }

  private setupLinks(): void {
    this.visibleLinks = this.links.filter((link: LinkItem): boolean => {
      if (link.permission) {
        return this.authPermission.isPermitted(`${link.permission}:view`);
      }
      return true;
    });
  }

  private showError(error: RestApiError): void {
    if (error.isValidataionError()) {
      this.snackBar.open(error.getFirstValidationError(), 'OK', { duration: 5000 });
    } else {
      this.snackBar.open(error.getError(), 'MER', { duration: 5000 }).onAction().subscribe(() => alert(error.getReason()));
    }
  }

}
