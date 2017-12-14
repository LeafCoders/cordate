import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, AssetFolder } from './rest-api.model';

export interface AssetFolderUpdate {
  id: number;
  idAlias: string;
  name: string;
  description: string;
  allowedMimeTypes: string;
}

@Injectable()
export class AssetFoldersResource extends DefaultBaseResource<AssetFolder, AssetFolderUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'assetFolders', apiError);
  }

  newInstance(data?: any): AssetFolder {
    return new AssetFolder(data ? data : {});
  }

  updateInstance(from: AssetFolder): AssetFolderUpdate {
    return <AssetFolderUpdate>{ id: from.id };
  }

}
