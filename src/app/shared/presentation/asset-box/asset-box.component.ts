import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-box',
  templateUrl: './asset-box.component.html',
  styleUrls: ['./asset-box.component.scss']
})
export class AssetBoxComponent {
  asset: Asset;

  @Input('asset')
  set setAsset(asset: Asset) {
    this.asset = asset;
  }
}
