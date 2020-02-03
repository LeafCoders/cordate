import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-list-item',
  templateUrl: './asset-list-item.component.html',
  styleUrls: ['./asset-list-item.component.scss']
})
export class AssetListItemComponent {
  asset: Asset;

  @Input('asset')
  set setAsset(asset: Asset) {
    this.asset = asset;
  }
}
