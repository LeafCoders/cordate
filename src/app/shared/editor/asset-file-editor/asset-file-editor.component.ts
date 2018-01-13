import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { EditorState } from '../editor-state';
import { AssetsResource } from '../../server/assets.resource';
import { Asset, AssetList, AssetFolder } from '../../server/rest-api.model';
import { SelectAssetDialogComponent } from '../../dialog/select-asset-dialog/select-asset-dialog.component';

@Component({
  selector: 'lc-asset-file-editor',
  templateUrl: './asset-file-editor.component.html',
})
export class AssetFileEditorComponent {

  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<Asset> = new EventEmitter<Asset>();

  asset: Asset;
  assetFolder: AssetFolder = new AssetFolder({ id: 1 });
  isDragOver: boolean = false;

  private dropState: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';
  private selectAssetFileDialogRef: MatDialogRef<SelectAssetDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private assetsResource: AssetsResource
  ) { }

  @Input('asset')
  set setInAssetFile(inAssetFile: Asset) {
    this.asset = inAssetFile;
  }

  @Input('assetFolder')
  set setInAssetFileFolder(inAssetFolder: AssetFolder) {
    this.assetFolder = inAssetFolder;
  }

  showSelectDialog(): void {
    this.selectAssetFileDialogRef = this.dialog.open(SelectAssetDialogComponent, { width: '80vw' });
    this.selectAssetFileDialogRef.componentInstance.setAssetFolder(this.assetFolder);
    this.selectAssetFileDialogRef.componentInstance.selectAsset(this.asset);

    this.selectAssetFileDialogRef.afterClosed().subscribe((selection: AssetList) => {
      if (selection) {
        this.asset = selection.length ? selection[0] : undefined;
        this.changedEmitter.emit(this.asset);
      }
    });
  }

  clear(): void {
    this.asset = undefined;
    this.changedEmitter.emit(this.asset);
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

  fileSelected(fileChangeEvent: { target: { files: FileList } }): void {
    if (this.dropState !== 'UPLOADING') {
      this.uploadFile(fileChangeEvent.target.files[0]);
    }
  }

  private uploadFile(file: File): void {
    if (this.dropState !== 'UPLOADING' && file) {
      let fileName: string = this.assetsResource.makeSafeFileName(file.name);
      this.assetsResource.createFile(this.assetFolder.id, { file: file, fileName: fileName, mimeType: file.type }).subscribe((asset: Asset) => {
        this.asset = asset;
        this.changedEmitter.emit(this.asset);
      });
    }
  }
}
