import { Component, Input } from '@angular/core';
import 'rxjs/add/operator/first';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetsResource } from '../shared/server/assets.resource';
import { Asset, AssetList, AssetFolder } from '../shared/server/rest-api.model';
import { itemsGrouper, ItemsGroup } from '../shared/items-grouper';
import { AssetFoldersResource } from '../shared/server/asset-folders.resource';

@Component({
  selector: 'lc-asset-list',
  templateUrl: './asset-list.component.html'
})
export class AssetListComponent extends BaseList<Asset> {

  currentAssetFolder: AssetFolder;
  assets: AssetList = [];

  constructor(
    private assetsResource: AssetsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(assetsResource);
  }

  protected init(): void {
  }

  @Input('assetFolder')
  set assetFolder(assetFolder: AssetFolder) {
    this.currentAssetFolder = assetFolder;
    this.assetsResource.setListParams({ assetFolderId: assetFolder.id });
    //this.assetsResource.setParent('assetFolders', assetFolder);
  }
}
