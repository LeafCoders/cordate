import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { AssetsResource } from '../../server/assets.resource';
import { Asset, AssetList, AssetFolder } from '../../server/rest-api.model';

@Component({
  selector: 'lc-select-asset-dialog',
  templateUrl: './select-asset-dialog.component.html',
  styleUrls: ['./select-asset-dialog.component.scss']
})
export class SelectAssetDialogComponent {

  private selection: Array<Asset> = [];
  private assetFolder: AssetFolder;
  assets: Array<Asset> = [];

  isDragOver: boolean = false;
  dropState: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';

  constructor(
    public dialogRef: MatDialogRef<SelectAssetDialogComponent>,
    private assetsResource: AssetsResource
  ) {
  }

  setAssetFolder(assetFolder: AssetFolder): void {
    this.assetFolder = assetFolder;
    this.assetsResource.setListParams({ assetFolderId: assetFolder.id });
    this.assetsResource.list().subscribe((assets: AssetList) => this.assets = assets);
  }

  selectAsset(asset: Asset): void {
    this.selection = asset ? [asset] : [];
  }

  isSelected(asset: Asset): boolean {
    return this.selection.some(selected => selected.idEquals(asset));
  }

  ok(): void {
    this.dialogRef.close(this.selection);
  }

  dragFilesOver(start: boolean): void {
    if (start) {
      if (this.dropState !== 'UPLOADING') {
        this.dropState = 'START';
        this.isDragOver = true;
      }
    } else {
      this.isDragOver = false;
    }
  }

  dragFilesDropped(droppedFile: FileList): void {
    if (this.dropState !== 'UPLOADING' && droppedFile.length === 1) {
      this.uploadFile(droppedFile[0]);
    }
  }

  fileSelected(fileChangeEvent: { target: { files: FileList } }): void {
    if (this.dropState !== 'UPLOADING') {
      this.uploadFile(fileChangeEvent.target.files[0]);
    }
  }

  private uploadFile(file: File): void {
    if (this.dropState !== 'UPLOADING' && file) {
      this.dropState = 'UPLOADING';
      let fileName: string = this.assetsResource.makeSafeFileName(file.name);
      this.assetsResource.createFile(this.assetFolder.id, { file: file, fileName: fileName, mimeType: file.type }).subscribe((asset: Asset) => {
        this.setAssetFolder(this.assetFolder);
        this.selectAsset(asset);
        this.dropState = 'SUCCESS';
      }, error => {
        this.dropState = 'FAILURE';
      });
    }
  }
}
