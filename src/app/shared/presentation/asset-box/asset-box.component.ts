import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-box',
  templateUrl: './asset-box.component.html',
  styleUrls: ['./asset-box.component.scss']
})
export class AssetBoxComponent {
  asset: Asset;
  fileType: 'UNKNOWN' | 'IMAGE' | 'AUDIO' = 'UNKNOWN';

  @Input('asset')
  set setAsset(asset: Asset) {
    this.asset = asset;
    if (asset.isImage) {
      this.fileType = 'IMAGE';
    } else if (asset.isAudio) {
      this.fileType = 'AUDIO';
    }
  }
}
