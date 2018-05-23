import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FilesDropModule } from 'ng2-files-drop';

import { environment } from '../../environments/environment';

import { RestApiService } from './server/rest-api.service';
import { RestApiErrorService } from './server/rest-api-error.service';
import { ArticlesResource } from './server/articles.resource';
import { ArticleSeriesResource } from './server/article-series.resource';
import { ArticleTypesResource } from './server/article-types.resource';
import { AssetFoldersResource } from './server/asset-folders.resource';
import { AssetsResource } from './server/assets.resource';
import { EventsResource } from './server/events.resource';
import { EventTypesResource } from './server/event-types.resource';
import { GroupsResource } from './server/groups.resource';
import { LocationsResource } from './server/locations.resource';
import { PermissionsResource } from './server/permissions.resource';
import { PodcastsResource } from './server/podcasts.resource';
import { SlideShowsResource } from './server/slide-shows.resource';
import { SlidesResource } from './server/slides.resource';
import { ResourcesResource } from './server/resources.resource';
import { ResourceTypesResource } from './server/resource-types.resource';
import { TextValuesResource } from './server/text-values.resource';
import { UsersResource } from './server/users.resource';

import { AppComponent } from '../app.component';
import { MyPagesComponent } from '../my-pages/my-pages.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { AuthPermissionService } from '../auth/auth-permission.service'
import { AuthService } from '../auth/auth.service';
import { AuthComponent } from '../auth/auth.component';

import { MainLayoutComponent } from './main-layout/main-layout.component';

import { AssetFileEditorComponent } from './editor/asset-file-editor/asset-file-editor.component';
import { BooleanEditorComponent } from './editor/boolean-editor/boolean-editor.component';
import { DateTimeEditorComponent } from './editor/date-time-editor/date-time-editor.component';
import { PasswordEditorComponent } from './editor/password-editor/password-editor.component';
import { RefEditorComponent } from './editor/ref-editor/ref-editor.component';
import { ResourceRefsEditorComponent } from './editor/resource-refs-editor/resource-refs-editor.component';
import { StaticEditorComponent } from './editor/static-editor/static-editor.component';
import { TextEditorComponent } from './editor/text-editor/text-editor.component';
import { TimeRangeEditorComponent } from './editor/time-range-editor/time-range-editor.component';

import { EditorContainerComponent } from './presentation/editor-container/editor-container.component';
import { PageHeaderComponent } from './presentation/page-header/page-header.component';
import { AssetBoxComponent } from './presentation/asset-box/asset-box.component';
import { AssetRowComponent } from './presentation/asset-row/asset-row.component';
import { DateTimeBoxComponent } from './date-time-box/date-time-box.component';

import { DoublePaneComponent } from './double-pane/double-pane.component';
import { ErrorBackgroundComponent } from './error-background/error-background.component';
import { ListComponent, ListActionsDirective, ListItemDirective } from './list/list.component'

import { SelectEventResourcesMenuComponent } from './select-event-resources-menu/select-event-resources-menu.component';

import { SelectAssetDialogComponent } from './dialog/select-asset-dialog/select-asset-dialog.component';
import { SingleSelectDialogComponent } from './dialog/single-select-dialog/single-select-dialog.component';

import { SignalService } from './signal.service';

import {
  MatButtonModule, MatDatepickerModule, MatDialogModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTabsModule,
  MatToolbarModule,
  MAT_DATE_LOCALE,
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PortalModule } from '@angular/cdk/portal';

let dataEditors = [
  AssetFileEditorComponent,
  DateTimeEditorComponent,
  PasswordEditorComponent,
  RefEditorComponent,
  ResourceRefsEditorComponent,
  StaticEditorComponent,
  TextEditorComponent,
  TimeRangeEditorComponent,
];

let dialogs = [
  SelectAssetDialogComponent,
  SingleSelectDialogComponent,
];

let presentations = [
  EditorContainerComponent,
  PageHeaderComponent,
  AssetBoxComponent,
  AssetRowComponent,
];

let services = [
  AuthService,
  AuthGuardService,
  AuthPermissionService,
  RestApiService,
  RestApiErrorService,
  SignalService,
];

let resourceServices = [
  ArticlesResource,
  ArticleSeriesResource,
  ArticleTypesResource,
  AssetFoldersResource,
  AssetsResource,
  EventsResource,
  EventTypesResource,
  GroupsResource,
  LocationsResource,
  PermissionsResource,
  PodcastsResource,
  SlideShowsResource,
  SlidesResource,
  ResourcesResource,
  ResourceTypesResource,
  TextValuesResource,
  UsersResource,
];

let materialModules = [
  PortalModule,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatMomentDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
];


export function jwtTokenGetter() {
  return localStorage.getItem('accessToken');
}

// Must not contain protocol or end with a '/'
export function jwtModuleCompatible(): string {
  let url = environment.rosetteUrl;
  url = url.replace('http://', '').replace('https://', '');
  return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
}

export function jwtModuleBlacklistRoutes(): string {
  return `${environment.rosetteUrl}auth`;
}

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: jwtTokenGetter,
    headerName: 'X-AUTH-TOKEN',
    authScheme: '',
    whitelistedDomains: [jwtModuleCompatible()],
    blacklistedRoutes: [jwtModuleBlacklistRoutes()]
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FilesDropModule,
    ...materialModules,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      }
    })
  ],
  declarations: [
    BooleanEditorComponent,
    DateTimeBoxComponent,
    DoublePaneComponent,
    ErrorBackgroundComponent,
    ListComponent, ListActionsDirective, ListItemDirective,
    MainLayoutComponent,
    SelectEventResourcesMenuComponent,
    ...dataEditors,
    ...presentations,
    ...dialogs,
  ],
  exports: [
    BooleanEditorComponent,
    DateTimeBoxComponent,
    DoublePaneComponent,
    ErrorBackgroundComponent,
    ListComponent, ListActionsDirective, ListItemDirective,
    MainLayoutComponent,
    SelectEventResourcesMenuComponent,
    ...dataEditors,
    ...presentations,
    ...dialogs,
    ...materialModules,
  ],
  entryComponents: [
    ...dialogs,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'sv-SE'
    },
    ...services,
    ...resourceServices,
  ],
})
export class SharedModule { }
