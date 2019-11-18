import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { ResourceComponent } from './resource.component';
import { ResourceListComponent } from './resource-list.component';
import { ResourceEditorComponent } from './resource-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    ResourceComponent,
    ResourceListComponent,
    ResourceEditorComponent,
  ],
  entryComponents: [],
})
export class ResourceModule { }
