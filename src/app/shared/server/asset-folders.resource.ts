import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from './rest-api.service';
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
  ) {
    super(api, 'assetFolders');
  }

  newInstance(data?: any): AssetFolder {
    return new AssetFolder(data ? data : {});
  }

  updateInstance(from: AssetFolder): AssetFolderUpdate {
    return <AssetFolderUpdate>{ id: from.id };
  }

}
