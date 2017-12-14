import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { BaseResource } from './base.resource';
import { UploadFolder, UploadFolderList } from './rest-api.model';

@Injectable()
export class UploadFoldersResource {

  private baseResource: BaseResource<UploadFolder, any>;
  private cachedUploadFolders: UploadFolderList = [];

  constructor(
    private api: RestApiService,
    apiError: RestApiErrorService
  ) {
    this.baseResource = new BaseResource<UploadFolder, any>(apiError, undefined);
  }

  list(reload: boolean = false): Observable<UploadFolderList> {
    if (!reload && this.cachedUploadFolders.length) {
      return Observable.of(this.cachedUploadFolders);
    }
    return this.baseResource.handleError<UploadFolderList>(
      this.api.read(`api/assetFolders`, {})
        .map((data: Response): UploadFolderList => {
          this.cachedUploadFolders = data.json().map(item => new UploadFolder(item))
          return this.cachedUploadFolders;
        })
    );
  }

  create(uploadFolder: UploadFolder): Observable<UploadFolder> {
    return this.baseResource.handleError<UploadFolder>(
      this.api.create('api/assetFolders', {}, uploadFolder)
        .map((data: Response): UploadFolder => {
          return new UploadFolder(data.json());
        })
    );
  }

}