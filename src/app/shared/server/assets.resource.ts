import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Asset, AssetFolder } from './rest-api.model';

export interface AssetUpdate {
  id: number;
  type: string;
  url: string;
}

export interface AssetFileData {
  file: File;
  fileName: string;
  mimeType: string;
}

@Injectable()
export class AssetsResource extends DefaultBaseResource<Asset, AssetUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'assets', apiError);
  }

  newInstance(data?: any): Asset {
    let asset: Asset = new Asset(data ? data : {});
    asset.setParent(<AssetFolder>this.parentItem);
    return asset;
  }

  updateInstance(from: Asset): AssetUpdate {
    return <AssetUpdate>{ id: from.id };
  }

  createFile(assetFolderId: number, fileData: AssetFileData): Observable<Asset> {
    let formData: FormData = new FormData();
    formData.append('folderId', assetFolderId.toString());
    formData.append('file', fileData.file, fileData.fileName);
    formData.append('fileName', fileData.fileName);
    let headers: Headers = new Headers({ 'Accept': 'application/json', 'enctype': 'multipart/form-data' });

    return this.handleError<Asset>(
      this.api.create(`api/assets/files`, {}, formData, headers)
        .map((data: Response): Asset => {
          return this.insertCreated(this.newInstance(data.json()));
        })
    );
  }

  makeSafeFileName(fileName: string): string {
    return fileName
      .replace(/[̊̈]/g, '')
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .replace(/__/g, '_');
  }

}
