import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';

import { UploadsResource } from '../../shared/server/uploads.resource';
import { Upload, UploadFolder } from '../../shared/server/rest-api.model';

interface UploadResult {
  fileName: string;
  responseData?: Upload;
  errorMessage?: string;
}

@Component({
  selector: 'lc-upload-new-dialog',
  templateUrl: './upload-new-dialog.component.html',
  styleUrls: ['./upload-new-dialog.component.scss']
})
export class UploadNewDialogComponent {

  public uploadFolder: UploadFolder;

  private isDragOver: boolean = false;
  private state: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';
  private results: Array<UploadResult> = [];

  constructor(
    public dialogRef: MatDialogRef<UploadNewDialogComponent>,
    private uploadsResource: UploadsResource
  ) { }

  dragFilesOver(start: boolean): void {
    if (start) {
      if (this.state !== 'UPLOADING') {
        this.state = 'START';
        this.isDragOver = true;
        this.results = [];
      }
    } else {
      this.isDragOver = false;
    }
  }

  dragFilesDropped(droppedFiles: FileList): void {
    if (this.state !== 'UPLOADING' && droppedFiles.length) {
      this.uploadFiles(Array.prototype.map.call(droppedFiles, file => file));
    }
  }

  filesSelected(fileChangeEvent: { target: { files: FileList } }): void {
    if (this.state !== 'UPLOADING') {
      this.uploadFiles(Array.prototype.map.call(fileChangeEvent.target.files, file => file));
    }
  }

  private uploadFiles(files: Array<File>): void {
    this.state = 'UPLOADING';
    this.results = [];
    Observable.forkJoin(
      files.map((file: File) => this.uploadFile(file))
    ).subscribe((data: Array<boolean>) => {
      this.state = data.every((status: boolean) => status) ? 'SUCCESS' : 'FAILURE';
    });
  }

  private uploadFile(file: File): Observable<boolean> {
    let fileName: string = this.uploadsResource.makeSafeFileName(file.name);
    // TODO: How to do this in the right way without <> cast
    return <Observable<boolean>>this.uploadsResource.create(this.uploadFolder.id, { file: file, fileName: fileName, mimeType: file.type })
      .do((response: Upload) => {
        this.results.push({ fileName: fileName, responseData: response });
        return Observable.of<boolean>(true);
      })
      .catch((response: Response) => {
        let errorMessage: string;
        if (response.status == 400) {
          let errors: Array<{ property: string, message: string }> = response.json();
          errorMessage = errors.map((error: { property: string, message: string }) => error.message).join(', ');
        } else {
          errorMessage = 'Okänt fel!';
        }
        this.results.push({ fileName: fileName, errorMessage: errorMessage });
        return Observable.of<boolean>(false);
      });
  }
}
