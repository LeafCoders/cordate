import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { SlideComponent } from './slide.component';
import { SlideListComponent } from './slide-list.component';
import { SlideEditorComponent } from './slide-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    SlideComponent,
    SlideListComponent,
    SlideEditorComponent,
  ]
})
export class SlideModule { }
