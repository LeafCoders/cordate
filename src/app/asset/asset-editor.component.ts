import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetsResource, AssetUpdate } from '../shared/server/assets.resource';
import { RestApiService } from '../shared/server/rest-api.service';
import { ConfirmDialogComponent } from '../shared/dialog/confirm-dialog/confirm-dialog.component';

import { Asset, AssetFolder } from '../shared/server/rest-api.model';


@Component({
  selector: 'lc-asset-editor',
  templateUrl: './asset-editor.component.html',
  styleUrls: ['./asset-editor.component.scss']
})
export class AssetEditorComponent extends BaseEditor<Asset, AssetUpdate> {

  assetFolder: AssetFolder;

  textContent: string;
  isDragOver: boolean = false;
  private dropState: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';

  @Input('assetFolder')
  set setAssetFolder(assetFolder: AssetFolder) {
    this.assetFolder = assetFolder;
  }

  constructor(
    private authPermission: AuthPermissionService,
    private assetsResource: AssetsResource,
    private restApiService: RestApiService,
    dialog: MatDialog,
  ) {
    super(assetsResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.assetsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.assetsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  protected afterSetEditorItem(asset: Asset): void {
    if (asset.isTextFile) {
      this.readAssetData(asset);
    } else if (asset.type === 'URL') {
      this.textContent = asset.url;
    } else {
      this.textContent = 'Innehåll saknas';
    }
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
    if (this.dropState !== 'UPLOADING' && droppedFile.length) {
      this.uploadFile(droppedFile[0]);
    }
  }

  private uploadFile(file: File): void {
    if (this.dropState !== 'UPLOADING' && file) {
      this.dialog.open(ConfirmDialogComponent).componentInstance.init("Skriva över?", "Den nuvarande filen kommer att skrivas över med den filen du släppte här.", "SKRIV ÖVER", false, () => {
        this.assetsResource.updateFile(this.item.id, { file: file, fileName: this.item.fileName, mimeType: file.type }).subscribe((asset: Asset) => {
          this.item = asset;
          this.readAssetData(asset);
        });
      });
    }
  }

  private readAssetData(asset: Asset): void {
    let fileId: string = asset.url;
    while (fileId.includes('/')) {
      fileId = fileId.substr(fileId.indexOf('/') + 1);
    }
    this.restApiService.readFileData(fileId, asset.mimeType).subscribe((data: Blob) => {
      var reader = new FileReader();
      reader.onload = () => {
        this.textContent = <string>reader.result;
      };
      reader.readAsText(data);
    });
  }
}
