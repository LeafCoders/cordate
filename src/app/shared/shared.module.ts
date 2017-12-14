import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { RouterModule } from '@angular/router';

import { FilesDropModule } from 'ng2-files-drop';

import { tokenNotExpired, AuthConfig, AuthHttp } from 'angular2-jwt';

import { RestApiService } from './server/rest-api.service';
import { RestApiErrorService } from './server/rest-api-error.service';
import { ArticlesResource, ArticlesResourceGuard } from './server/articles.resource';
import { ArticleSeriesResource } from './server/article-series.resource';
import { AssetFoldersResource } from './server/asset-folders.resource';
import { AssetsResource } from './server/assets.resource';
import { EducationsResource } from './server/educations.resource';
import { EducationThemesResource } from './server/education-themes.resource';
import { EducationTypesResource } from './server/education-types.resource';
import { EventsResource } from './server/events.resource';
import { EventTypesResource } from './server/event-types.resource';
import { GroupsResource } from './server/groups.resource';
import { LocationsResource } from './server/locations.resource';
import { PermissionsResource } from './server/permissions.resource';
import { SlideShowsResource } from './server/slide-shows.resource';
import { SlidesResource } from './server/slides.resource';
import { ResourcesResource } from './server/resources.resource';
import { ResourceTypesResource } from './server/resource-types.resource';
import { TextValuesResource } from './server/text-values.resource';
import { UploadsResource } from './server/uploads.resource';
import { UploadFoldersResource } from './server/upload-folders.resource';
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
import { PasswordEditorComponent } from './editor/password-editor/password-editor.component';
import { RefEditorComponent } from './editor/ref-editor/ref-editor.component';
import { RefOrTextEditorComponent, RefOrTextDialog } from './editor/ref-or-text-editor/ref-or-text-editor.component';
import { StaticEditorComponent } from './editor/static-editor/static-editor.component';
import { TextEditorComponent } from './editor/text-editor/text-editor.component';
import { TimeRangeEditorComponent } from './editor/time-range-editor/time-range-editor.component';
import { UploadEditorComponent } from './editor/upload-editor/upload-editor.component';

import { EditorContainerComponent } from './presentation/editor-container/editor-container.component';
import { PageHeaderComponent } from './presentation/page-header/page-header.component';
import { UploadBoxComponent } from './presentation/upload-box/upload-box.component';
import { UploadRowComponent } from './presentation/upload-row/upload-row.component';
import { DateTimeBoxComponent } from './date-time-box/date-time-box.component';

import { DoublePaneComponent } from './double-pane/double-pane.component';
import { ErrorBackgroundComponent } from './error-background/error-background.component';
import { DescriptionEditorComponent } from './description-editor/description-editor.component';
import { ListComponent, ListActionsDirective, ListItemDirective } from './list/list.component'

import { TimeRangeSelectComponent } from './time-range-select/time-range-select.component';
import { ObjectSelectComponent } from './object-select/object-select.component';
import { UserResourceMenuComponent } from './user-resource-menu/user-resource-menu.component';
import { UserResourceSelectComponent } from './user-resource-select/user-resource-select.component';

import { SelectUploadDialogComponent } from './dialog/select-upload-dialog/select-upload-dialog.component';
import { SelectAssetDialogComponent } from './dialog/select-asset-dialog/select-asset-dialog.component';

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
  PasswordEditorComponent,
  RefEditorComponent,
  RefOrTextEditorComponent,
  StaticEditorComponent,
  TextEditorComponent,
  TimeRangeEditorComponent,
  UploadEditorComponent,
];

let dialogs = [
  RefOrTextDialog,
  SelectUploadDialogComponent,
  SelectAssetDialogComponent,
];

let presentations = [
  EditorContainerComponent,
  PageHeaderComponent,
  UploadBoxComponent,
  UploadRowComponent,
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
  ArticlesResourceGuard,
  ArticlesResource,
  ArticleSeriesResource,
  AssetFoldersResource,
  AssetsResource,
  EducationsResource,
  EducationThemesResource,
  EducationTypesResource,
  EventsResource,
  EventTypesResource,
  GroupsResource,
  LocationsResource,
  PermissionsResource,
  SlideShowsResource,
  SlidesResource,
  ResourcesResource,
  ResourceTypesResource,
  TextValuesResource,
  UploadsResource,
  UploadFoldersResource,
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

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'X-AUTH-TOKEN',
    noTokenScheme: true,
    noJwtError: true,
    tokenName: 'accessToken',
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    RouterModule,
    FilesDropModule,
    ...materialModules,
  ],
  declarations: [
    BooleanEditorComponent,
    DateTimeBoxComponent,
    DescriptionEditorComponent,
    DoublePaneComponent,
    ErrorBackgroundComponent,
    ListComponent, ListActionsDirective, ListItemDirective,
    MainLayoutComponent,
    UserResourceMenuComponent,
    ...dataEditors,
    ...presentations,
    ...dialogs,
  ],
  exports: [
    BooleanEditorComponent,
    DateTimeBoxComponent,
    DescriptionEditorComponent,
    DoublePaneComponent,
    ErrorBackgroundComponent,
    ListComponent, ListActionsDirective, ListItemDirective,
    MainLayoutComponent,
    UserResourceMenuComponent,
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
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'sv-SE'
    },
    ...services,
    ...resourceServices,
  ],
})
export class SharedModule { }
