import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
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
    super(api, 'assets', apiError, (a: Asset, b: Asset) => a.id < b.id);
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

    return this.handleError<Asset>(
      this.api.createMultiPart(`api/assets/files`, {}, formData)
        .map((data: JSON): Asset => {
          return this.insertCreated(this.newInstance(data));
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
