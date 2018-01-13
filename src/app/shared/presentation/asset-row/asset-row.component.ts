import { Component, Input } from '@angular/core';

import { Asset } from '../../server/rest-api.model';

@Component({
  selector: 'lc-asset-row',
  templateUrl: './asset-row.component.html',
  styleUrls: ['./asset-row.component.scss']
})
export class AssetRowComponent {
  private asset: Asset;
  private fileType: 'UNKNOWN' | 'IMAGE' | 'AUDIO' = 'UNKNOWN';

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
