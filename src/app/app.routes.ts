import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { ForgottenComponent } from './auth/forgotten/forgotten.component';
import { GroupComponent } from './group/group.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MyPagesComponent } from './my-pages/my-pages.component';
import { ArticleComponent } from './article/article.component';
import { ArticleSerieComponent } from './article-serie/article-serie.component';
import { AssetFolderComponent } from './asset-folder/asset-folder.component';
import { EventComponent } from './event/event.component';
import { EventTypeComponent } from './event-type/event-type.component';
import { PermissionComponent } from './permission/permission.component';
import { PodcastComponent } from './podcast/podcast.component';
import { ResourceComponent } from './resource/resource.component';
import { ResourceTypeComponent } from './resource-type/resource-type.component';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { SlideComponent } from './slide/slide.component';
import { TextValueComponent } from './text-value/text-value.component';
import { UploadComponent } from './upload/upload.component';
import { UserComponent } from './user/user.component';

import { ArticleType } from './shared/server/rest-api.model';
import { ArticlesResourceGuard } from './shared/server/articles.resource';

export const ROUTES: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgotten', component: ForgottenComponent },
      { path: '**', redirectTo: '/auth/login' }
    ]
  },
  {
    path: '', component: MainLayoutComponent, children: [
      { path: 'mypages', component: MyPagesComponent, canActivate: [AuthGuardService] },
      { path: 'sermons', component: ArticleComponent, canActivate: [AuthGuardService, ArticlesResourceGuard], data: { articleType: ArticleType.SERMON } },
      { path: 'sermonSeries', component: ArticleSerieComponent, canActivate: [AuthGuardService, ArticlesResourceGuard], data: { articleType: ArticleType.SERMON } },
      { path: 'assetFolders', component: AssetFolderComponent, canActivate: [AuthGuardService] },
      { path: 'events', component: EventComponent, canActivate: [AuthGuardService] },
      { path: 'eventTypes', component: EventTypeComponent, canActivate: [AuthGuardService] },
      { path: 'groups', component: GroupComponent, canActivate: [AuthGuardService] },
      { path: 'permissions', component: PermissionComponent, canActivate: [AuthGuardService] },
      { path: 'podcasts', component: PodcastComponent, canActivate: [AuthGuardService] },
      { path: 'resources', component: ResourceComponent, canActivate: [AuthGuardService] },
      { path: 'resourceTypes', component: ResourceTypeComponent, canActivate: [AuthGuardService] },
      { path: 'slideShows', component: SlideShowComponent, canActivate: [AuthGuardService] },
      { path: 'slides', component: SlideComponent, canActivate: [AuthGuardService] },
      { path: 'textValues', component: TextValueComponent, canActivate: [AuthGuardService] },
      { path: 'uploads', component: UploadComponent, canActivate: [AuthGuardService] },
      { path: 'users', component: UserComponent, canActivate: [AuthGuardService] },
      { path: '**', redirectTo: '/mypages' }
    ]
  },
];
