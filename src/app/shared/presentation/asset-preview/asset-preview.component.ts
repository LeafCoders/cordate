import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.scss']
})
export class AssetPreviewComponent {
  asset: Asset;

  @Input('asset')
  set setAsset(asset: Asset) {
    this.asset = asset;
  }
}
