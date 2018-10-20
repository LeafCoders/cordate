import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-row',
  templateUrl: './asset-row.component.html',
  styleUrls: ['./asset-row.component.scss']
})
export class AssetRowComponent {
  asset: Asset;

  @Input('asset')
  set setAsset(asset: Asset) {
    this.asset = asset;
  }
}
