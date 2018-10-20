import { Component, Input } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AssetsResource } from '../shared/server/assets.resource';
import { Asset, AssetList, AssetFolder } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent extends BaseList<Asset> {

  currentAssetFolder: AssetFolder;
  assets: AssetList = [];

  constructor(
    private assetsResource: AssetsResource,
  ) {
    super(assetsResource);
  }

  protected init(): void {
  }

  @Input('assetFolder')
  set assetFolder(assetFolder: AssetFolder) {
    this.currentAssetFolder = assetFolder;
    this.assetsResource.setListParams({ assetFolderId: assetFolder.id });
  }
}
