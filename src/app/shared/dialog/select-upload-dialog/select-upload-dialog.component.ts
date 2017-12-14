import { Component, HostBinding } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UploadsResource } from '../../server/uploads.resource';
import { Upload, UploadList } from '../../server/rest-api.model';

@Component({
  selector: 'lc-select-upload-dialog',
  templateUrl: './select-upload-dialog.component.html',
  styleUrls: ['./select-upload-dialog.component.scss']
})
export class SelectUploadDialogComponent {

  private selection: Array<Upload> = [];
  private uploads: Array<Upload> = [];
  private uploadFolderId: number;

  private isDragOver: boolean = false;
  private dropState: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';

  constructor(
    private dialogRef: MatDialogRef<SelectUploadDialogComponent>,
    private uploadsResource: UploadsResource
  ) {
  }

  setUploadFolder(folderId: number): void {
    this.uploadFolderId = folderId;
    this.uploadsResource.list(folderId, true).subscribe((uploads: UploadList) => {
      this.uploads = uploads.reverse();
    });
  }

  selectUpload(upload: Upload): void {
    this.selection = upload ? [upload] : [];
  }

  isSelected(upload: Upload): boolean {
    return this.selection.some(selected => selected.idEquals(upload));
  }

  ok(): void {
    this.dialogRef.close(this.selection);
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
    if (this.dropState !== 'UPLOADING' && droppedFile.length === 1) {
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
        this.setUploadFolder(this.uploadFolderId);
        this.selectUpload(upload);
      });
    }
  }
}
