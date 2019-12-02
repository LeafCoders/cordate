import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AssetFoldersResource } from '../shared/server/asset-folders.resource';
import { AssetFolder } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-asset-folder-list',
  templateUrl: './asset-folder-list.component.html'
})
export class AssetFolderListComponent extends BaseList<AssetFolder> {

  constructor(
    assetFoldersResource: AssetFoldersResource,
  ) {
    super(assetFoldersResource, () => assetFoldersResource.list());
  }

  protected init(): void {
  }

}
