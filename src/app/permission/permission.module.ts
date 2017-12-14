import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { PermissionComponent } from './permission.component';
import { PermissionListComponent } from './permission-list.component';
import { PermissionEditorComponent } from './permission-editor.component';
import { PermissionNewDialogComponent } from './new-dialog/permission-new-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    PermissionComponent,
    PermissionListComponent,
    PermissionEditorComponent,
    PermissionNewDialogComponent,
  ],
  entryComponents: [
    PermissionNewDialogComponent,
  ],
})
export class PermissionModule { }
