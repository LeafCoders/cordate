import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription, Subscriber } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ArticleTypeList } from '../server/rest-api.model';
import { SignalService } from '../signal.service';
import { RestApiError } from '../../shared/server/rest-api-error.model';
import { RestApiErrorService } from '../../shared/server/rest-api-error.service';
import { AuthService } from '../../auth/auth.service';
import { AuthPermissionService } from '../../auth/auth-permission.service';
import { ArticleTypesResource } from '../server/article-types.resource';

interface LinkItem {
  permission: string;
  icon: string,
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

  rootLinks: Array<LinkItem> = [];
  mediaLinks: Array<LinkItem> = [];
  articleLinks: Array<LinkItem> = [];
  userLinks: Array<LinkItem> = [];
  exportLinks: Array<LinkItem> = [];
  configurationLinks: Array<LinkItem> = [];
  hasNoLinks: boolean = false;

  sideModeQuery: MediaQueryList;
  private subscription: Subscription;
  private articleTypes: ArticleTypeList;

  @ViewChild(MatSidenav, { static: false })
  private sideNav: MatSidenav;

  constructor(
    public router: Router,
    public authService: AuthService,
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

    let subscriber = new Subscriber<ArticleTypeList>((articleTypes: ArticleTypeList) => {
      this.articleTypes = articleTypes;
      this.setupLinks();
      subscriber.unsubscribe();
    });
    articleTypesResource.list().subscribe(subscriber);
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
      this.setupLinks();
      this.signalService.requestOpenSideNav();
    }
  }

  closeNav(): void {
    if (!this.sideModeQuery.matches) {
      this.sideNav.close();
    }
  }

  private setupLinks(): void {
    this.rootLinks = [
      this.linkIfPermitted({ permission: 'events', icon: 'event', title: 'Händelser', routePath: '/events' }),
    ].filter(link => link);

    this.mediaLinks = [
      this.linkIfPermitted({ permission: 'slides', icon: 'filter', title: 'Bildspel', routePath: '/slides' }),
      this.linkIfPermitted({ permission: 'assets', icon: 'attach_file', title: 'Filer', routePath: '/assets' }),
    ].filter(link => link);

    this.articleLinks = [];
    if (this.articleTypes) {
      this.articleTypes.forEach(at => this.articleLinks.push({
        permission: at.idAlias, icon: 'filter_none', title: at.articleSeriesTitle, routePath: `/articleSeries/${at.idAlias}`
      }));
      this.articleTypes.forEach(at => this.articleLinks.push({
        permission: at.idAlias, icon: 'crop_square', title: at.articlesTitle, routePath: `/articles/${at.idAlias}`
      }));
    }

    this.userLinks = [
      this.linkIfPermitted({ permission: 'users', icon: 'person', title: 'Användare', routePath: '/users' }),
      this.linkIfPermitted({ permission: 'groups', icon: 'group', title: 'Grupper', routePath: '/groups' }),
      this.linkIfPermitted({ permission: 'resources', icon: 'account_box', title: 'Resurser', routePath: '/resources' }),
    ].filter(link => link);

    this.exportLinks = [
      this.linkIfPermitted({ permission: 'podcasts', icon: 'rss_feed', title: 'Podcasts', routePath: '/podcasts' }),
    ].filter(link => link);

    this.configurationLinks = [
      this.linkIfPermitted({ permission: 'permissions', icon: 'security', title: 'Behörigheter', routePath: '/permissions' }),
      this.linkIfPermitted({ permission: 'permissionSets', icon: 'security', title: 'Behörighets-set', routePath: '/permissionSets' }),
      this.linkIfPermitted({ permission: 'resourceTypes', icon: 'local_offer', title: 'Resurstyper', routePath: '/resourceTypes' }),
      this.linkIfPermitted({ permission: 'eventTypes', icon: 'local_offer', title: 'Händelsetyper', routePath: '/eventTypes' }),
      this.linkIfPermitted({ permission: 'articleTypes', icon: 'local_offer', title: 'Artikeltyper', routePath: '/articleTypes' }),
      this.linkIfPermitted({ permission: 'assetFolders', icon: 'folder', title: 'Filkataloger', routePath: '/assetFolders' }),
      this.linkIfPermitted({ permission: 'slideShows', icon: 'filter', title: 'Bildspelsenheter', routePath: '/slideShows' }),
      this.linkIfPermitted({ permission: 'messages', icon: 'short_text', title: 'Meddelanden', routePath: '/messages' }),
    ].filter(link => link);

    this.hasNoLinks = [this.rootLinks, this.mediaLinks, this.articleLinks, this.userLinks, this.exportLinks, this.configurationLinks].every(list => list.length === 0);
  }

  private linkIfPermitted(link: LinkItem): LinkItem {
    if (!link.permission || this.authPermission.isPermitted(`${link.permission}:view`)) {
      return link;
    }
    return undefined;
  }

  private showError(error: RestApiError): void {
    if (error.isValidataionError()) {
      this.snackBar.open(error.getFirstValidationError(), 'OK', { duration: 10000 });
    } else {
      this.snackBar.open(error.getError(), 'MER', { duration: 10000 }).onAction().subscribe(() => alert(error.getReason()));
    }
  }

}
