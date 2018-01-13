import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

//import { MdNativeDateModule } from '@angular/material';
//import { OVERLAY_PROVIDERS } from '@angular/material/core';

import { ROUTES } from './app.routes';


import { AppComponent } from './app.component';
import { MyPagesComponent } from './my-pages/my-pages.component';

import { SharedModule } from './shared/shared.module';
import { ArticleModule } from './article/article.module';
import { ArticleSerieModule } from './article-serie/article-serie.module';
import { AuthModule } from './auth/auth.module';
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
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

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
    //MdNativeDateModule,

    ArticleModule,
    ArticleSerieModule,
    AuthModule,
    SharedModule,
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
    UploadModule,
    UserModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
