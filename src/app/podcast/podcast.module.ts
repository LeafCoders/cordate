import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { PodcastComponent } from './podcast.component';
import { PodcastListComponent } from './podcast-list.component';
import { PodcastEditorComponent } from './podcast-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    PodcastComponent,
    PodcastListComponent,
    PodcastEditorComponent,
  ],
  entryComponents: [],
})
export class PodcastModule { }
