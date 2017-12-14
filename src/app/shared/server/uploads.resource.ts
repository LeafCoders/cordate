import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { Upload, UploadList } from './rest-api.model';

export interface UploadFileData {
  file: File;
  fileName: string;
  mimeType: string;
}

@Injectable()
export class UploadsResource {

  private baseResource: BaseResource<Upload, any>;
  private cachedUploads: { [uploadFolderId: number]: UploadList } = {};

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<Upload, any>(apiError, undefined);
  }

  list(uploadFolderId: number, reload: boolean = false): Observable<UploadList> {
    if (!reload && this.cachedUploads[uploadFolderId] && this.cachedUploads[uploadFolderId].length) {
      return Observable.of(this.cachedUploads[uploadFolderId]);
    }
    return this.baseResource.handleError<UploadList>(
      this.api.read(`api/assets`, { folderId: uploadFolderId })
        .map((data: Response): UploadList => {
          this.cachedUploads[uploadFolderId] = data.json().map(item => new Upload(item))
          return this.cachedUploads[uploadFolderId];
        })
    );
  }

  create(uploadFolderId: number, upload: UploadFileData): Observable<Upload> {
    let formData: FormData = new FormData();
    formData.append('folderId', uploadFolderId.toString());
    formData.append('file', upload.file, upload.fileName);
    formData.append('fileName', upload.fileName);
    let headers: Headers = new Headers({ 'Accept': 'application/json', 'enctype': 'multipart/form-data' });
    return this.baseResource.handleError<Upload>(
      this.api.create(`api/assets/files`, {}, formData, headers)
        .map((data: Response): Upload => {
          return new Upload(data.json());
        })
    );
  }

  public makeSafeFileName(fileName: string): string {
    return fileName
      .replace(/[̊̈]/g, '')
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .replace(/__/g, '_');
  }
}