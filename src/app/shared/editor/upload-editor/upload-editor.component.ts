import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { EditorState } from '../editor-state';
import { SelectUploadDialogComponent } from '../../dialog/select-upload-dialog/select-upload-dialog.component';
import { UploadsResource } from '../../server/uploads.resource';
import { Upload, UploadList } from '../../server/rest-api.model';

@Component({
  selector: 'lc-upload-editor',
  templateUrl: './upload-editor.component.html',
  styleUrls: ['./upload-editor.component.scss']
})
export class UploadEditorComponent {

  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<Upload> = new EventEmitter<Upload>();

  private upload: Upload;
  private uploadFolderId: number;
  private isDragOver: boolean = false;
  private dropState: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';

  private selectUploadDialogRef: MatDialogRef<SelectUploadDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private uploadsResource: UploadsResource
  ) { }

  @Input('upload')
  set setInUpload(inUpload: Upload) {
    this.upload = inUpload;
  }

  @Input('uploadFolderId')
  set setInUploadFolderId(inUploadFolderId: number) {
    this.uploadFolderId = inUploadFolderId;
  }

  showSelectDialog(): void {
    this.selectUploadDialogRef = this.dialog.open(SelectUploadDialogComponent, { width: '80vw' });
    this.selectUploadDialogRef.componentInstance.setUploadFolder(this.uploadFolderId);
    this.selectUploadDialogRef.componentInstance.selectUpload(this.upload);

    this.selectUploadDialogRef.afterClosed().subscribe((selection: UploadList) => {
      if (selection) {
        this.upload = selection.length ? selection[0] : undefined;
        this.changedEmitter.emit(this.upload);
      }
    });
  }

  clear(): void {
    this.upload = undefined;
    this.changedEmitter.emit(this.upload);
  }

  dragFilesOver(start: boolean): void {
    if (start) {
      if (this.dropState !== 'UPLOADING') {
        this.dropState = 'START';
        this.isDragOver = true;
      }
    } else {
      this.isDragOver = false;
    }
  }

  dragFilesDropped(droppedFile: FileList): void {
    if (this.dropState !== 'UPLOADING' && droppedFile.length) {
      this.uploadFile(droppedFile[0]);
    }
  }

  fileSelected(fileChangeEvent: { target: { files: FileList } }): void {
    if (this.dropState !== 'UPLOADING') {
      this.uploadFile(fileChangeEvent.target.files[0]);
    }
  }

  private uploadFile(file: File): void {
    if (this.dropState !== 'UPLOADING' && file) {
      let fileName: string = this.uploadsResource.makeSafeFileName(file.name);
      this.uploadsResource.create(this.uploadFolderId, { file: file, fileName: fileName, mimeType: file.type }).subscribe((upload: Upload) => {
        this.upload = upload;
        this.changedEmitter.emit(this.upload);
      });
    }
  }
}
