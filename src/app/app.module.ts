import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { MyPagesComponent } from './my-pages/my-pages.component';
import { ArticleTypeGuard } from './article-type.guard';

import { SharedModule } from './shared/shared.module';
import { ArticleModule } from './article/article.module';
import { ArticleSerieModule } from './article-serie/article-serie.module';
import { ArticleTypeModule } from './article-type/article-type.module';
import { AuthModule } from './auth/auth.module';
import { AssetModule } from './asset/asset.module';
import { AssetFolderModule } from './asset-folder/asset-folder.module';
import { EventModule } from './event/event.module';
import { EventTypeModule } from './event-type/event-type.module';
import { GroupModule } from './group/group.module';
import { PermissionModule } from './permission/permission.module';
import { PodcastModule } from './podcast/podcast.module';
import { ResourceModule } from './resource/resource.module';
import { ResourceTypeModule } from './resource-type/resource-type.module';
import { SlideShowModule } from './slide-show/slide-show.module';
import { SlideModule } from './slide/slide.module';
import { TextValueModule } from './text-value/text-value.module';
import { UserModule } from './user/user.module';

export const CORDATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    MyPagesComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),

    ArticleModule,
    ArticleSerieModule,
    ArticleTypeModule,
    AuthModule,
    SharedModule,
    AssetModule,
    AssetFolderModule,
    EventModule,
    EventTypeModule,
    GroupModule,
    PermissionModule,
    PodcastModule,
    ResourceModule,
    ResourceTypeModule,
    SlideShowModule,
    SlideModule,
    TextValueModule,
    UserModule,
  ],
  entryComponents: [],
  providers: [
    ArticleTypeGuard,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CORDATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
