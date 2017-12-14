import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { SlideShowComponent } from './slide-show.component';
import { SlideShowListComponent } from './slide-show-list.component';
import { SlideShowEditorComponent } from './slide-show-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    SlideShowComponent,
    SlideShowListComponent,
    SlideShowEditorComponent,
  ]
})
export class SlideShowModule { }
