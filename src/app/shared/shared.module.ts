import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { QuillModule } from 'ngx-quill';

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
import { MessagesResource } from './server/messages.resource';
import { PermissionsResource } from './server/permissions.resource';
import { PermissionSetsResource } from './server/permission-sets.resource';
import { PodcastsResource } from './server/podcasts.resource';
import { SlideShowsResource } from './server/slide-shows.resource';
import { SlidesResource } from './server/slides.resource';
import { ResourcesResource } from './server/resources.resource';
import { ResourceTypesResource } from './server/resource-types.resource';
import { TextValuesResource } from './server/text-values.resource';
import { UsersResource } from './server/users.resource';

import { AuthGuardService } from '../auth/auth-guard.service';
import { AuthPermissionService } from '../auth/auth-permission.service'
import { AuthService } from '../auth/auth.service';

import { MainLayoutComponent } from './main-layout/main-layout.component';

import { AssetFileEditorComponent } from './editor/asset-file-editor/asset-file-editor.component';
import { BooleanEditorComponent } from './editor/boolean-editor/boolean-editor.component';
import { DateTimeEditorComponent } from './editor/date-time-editor/date-time-editor.component';
import { HtmlTextEditorComponent } from './editor/html-text-editor/html-text-editor.component';
import { OptionEditorComponent } from './editor/option-editor/option-editor.component';
import { PasswordEditorComponent } from './editor/password-editor/password-editor.component';
import { RefEditorComponent } from './editor/ref-editor/ref-editor.component';
import { ResourceRefsEditorComponent } from './editor/resource-refs-editor/resource-refs-editor.component';
import { StaticEditorComponent } from './editor/static-editor/static-editor.component';
import { TextEditorComponent } from './editor/text-editor/text-editor.component';
import { TimeRangeEditorComponent } from './editor/time-range-editor/time-range-editor.component';

import { DragHandleComponent } from './presentation/drag-handle/drag-handle.component';
import { EditorContainerComponent } from './presentation/editor-container/editor-container.component';
import { PageHeaderComponent } from './presentation/page-header/page-header.component';
import { AssetBoxComponent } from './presentation/asset-box/asset-box.component';
import { AssetListItemComponent } from './presentation/asset-list-item/asset-list-item.component';
import { AssetPreviewComponent } from './presentation/asset-preview/asset-preview.component';
import { DateTimeBoxComponent } from './date-time-box/date-time-box.component';

import { DoublePaneComponent } from './double-pane/double-pane.component';
import { ErrorBackgroundComponent } from './error-background/error-background.component';
import { ListComponent, ListActionsDirective, ListItemDirective } from './list/list.component'

import { SelectResourcesMenuComponent } from './select-resources-menu/select-resources-menu.component';

import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { PermissionWizardDialogComponent } from './dialog/permission-wizard-dialog/permission-wizard-dialog.component';
import { SelectAssetDialogComponent } from './dialog/select-asset-dialog/select-asset-dialog.component';
import { SelectResourcesDialogComponent } from './dialog/select-resources-dialog/select-resources-dialog.component';
import { SendMessageDialogComponent } from './dialog/send-message-dialog/send-message-dialog.component';
import { SingleSelectDialogComponent } from './dialog/single-select-dialog/single-select-dialog.component';

import { CurrentUserService } from './current-user.service';
import { SendMessageDialogService } from './dialog/send-message-dialog/send-message-dialog.service';
import { SignalService } from './signal.service';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { FileDropDirective } from './util/file-drop/file-drop.directive';

let dataEditors = [
  AssetFileEditorComponent,
  DateTimeEditorComponent,
  HtmlTextEditorComponent,
  OptionEditorComponent,
  PasswordEditorComponent,
  RefEditorComponent,
  ResourceRefsEditorComponent,
  StaticEditorComponent,
  TextEditorComponent,
  TimeRangeEditorComponent,
];

let dialogs = [
  ConfirmDialogComponent,
  PermissionWizardDialogComponent,
  SelectAssetDialogComponent,
  SelectResourcesDialogComponent,
  SendMessageDialogComponent,
  SingleSelectDialogComponent,
];

let presentations = [
  DragHandleComponent,
  EditorContainerComponent,
  PageHeaderComponent,
  AssetBoxComponent,
  AssetListItemComponent,
  AssetPreviewComponent,
];

let utils = [
  FileDropDirective,
]

let services = [
  AuthService,
  AuthGuardService,
  AuthPermissionService,
  CurrentUserService,
  RestApiService,
  RestApiErrorService,
  SendMessageDialogService,
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
  MessagesResource,
  PermissionsResource,
  PermissionSetsResource,
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
  DragDropModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
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
  return url.indexOf('/') >= 0 ? url.substr(0, url.indexOf('/')) : url;
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
    QuillModule.forRoot(),
    ...materialModules,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [],
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
    SelectResourcesMenuComponent,
    ...dataEditors,
    ...presentations,
    ...dialogs,
    ...utils,
  ],
  exports: [
    BooleanEditorComponent,
    DateTimeBoxComponent,
    DoublePaneComponent,
    ErrorBackgroundComponent,
    ListComponent, ListActionsDirective, ListItemDirective,
    MainLayoutComponent,
    SelectResourcesMenuComponent,
    ...dataEditors,
    ...presentations,
    ...dialogs,
    ...utils,
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
