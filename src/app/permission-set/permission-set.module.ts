import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { PermissionSetComponent } from './permission-set.component';
import { PermissionSetListComponent } from './permission-set-list.component';
import { PermissionSetEditorComponent } from './permission-set-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    PermissionSetComponent,
    PermissionSetListComponent,
    PermissionSetEditorComponent,
  ],
  entryComponents: [
  ],
})
export class PermissionSetModule { }
