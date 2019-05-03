import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetFoldersResource } from '../shared/server/asset-folders.resource';
import { AssetsResource, AssetUpdate } from '../shared/server/assets.resource';
import { Asset, AssetFolder, AssetFolderList } from '../shared/server/rest-api.model';
import { AssetNewDialogComponent } from './new-dialog/asset-new-dialog.component';

@Component({
  selector: 'lc-asset',
  templateUrl: './asset.component.html'
})
export class AssetComponent extends BaseContainer<Asset> {

  assetFolders: AssetFolderList;
  selectedAssetFolder: AssetFolder;

  private newDialogRef: MatDialogRef<AssetNewDialogComponent>;

  constructor(
    private assetsResource: AssetsResource,
    private assetFoldersResource: AssetFoldersResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(assetsResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.assetsResource.createPermission());

    this.assetFoldersResource.list().subscribe((assetFolders: AssetFolderList) => {
      this.assetFolders = assetFolders;
      this.selectedAssetFolder = assetFolders[0];
    });
  }

  selectAssetFolder(assetFolder: AssetFolder): void {
    this.selectedAssetFolder = assetFolder;
  }

  showNewDialog(): void {
    if (this.allowAddNew && !this.newDialogRef) {
      this.newDialogRef = this.dialog.open(AssetNewDialogComponent, { width: '640px', maxWidth: '90vw' });
      this.newDialogRef.componentInstance.assetFolder = this.selectedAssetFolder;
      this.newDialogRef.afterClosed().subscribe(() => {
        this.newDialogRef = undefined
        this.assetsResource.list();
      });
    }
  }

  showNewLinkAsset(): void {
    let link: string = window.prompt("Ange länk");
    if (link) {
      let asset: AssetUpdate = {
        id: undefined,
        type: 'URL',
        url: link,
        folderId: this.selectedAssetFolder.id,
      };
      this.assetsResource.create(asset).subscribe((newLinkAsset: Asset) => {
        this.onItemSelected(newLinkAsset);
      });
    }
  }
}
