import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { GroupComponent } from './group.component';
import { GroupListComponent } from './group-list.component';
import { GroupEditorComponent } from './group-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    GroupComponent,
    GroupListComponent,
    GroupEditorComponent,
  ],
  entryComponents: [],
})
export class GroupModule { }
