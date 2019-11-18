import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { ResourceTypeComponent } from './resource-type.component';
import { ResourceTypeListComponent } from './resource-type-list.component';
import { ResourceTypeEditorComponent } from './resource-type-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    ResourceTypeComponent,
    ResourceTypeListComponent,
    ResourceTypeEditorComponent,
  ],
  entryComponents: [],
})
export class ResourceTypeModule { }
