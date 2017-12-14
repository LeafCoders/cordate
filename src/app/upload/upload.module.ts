import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesDropModule } from 'ng2-files-drop';

//import { DoublePaneComponent } from '../shared/double-pane/double-pane.component';

import { SharedModule } from '../shared/shared.module';
import { UploadComponent } from './upload.component';
import { UploadNewDialogComponent } from './upload-new-dialog/upload-new-dialog.component';
import { UploadListComponent } from './upload-list/upload-list.component';
import { UploadEditorComponent } from './upload-editor/upload-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FilesDropModule,
  ],
  declarations: [
    UploadComponent,
    UploadNewDialogComponent,
    UploadListComponent,
    UploadEditorComponent,
  ],
  entryComponents: [
    UploadNewDialogComponent,
  ],
})
export class UploadModule { }
