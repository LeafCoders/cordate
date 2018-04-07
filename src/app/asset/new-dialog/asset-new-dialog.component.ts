import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';

import { AssetsResource } from '../../shared/server/assets.resource';
import { Asset, AssetFolder } from '../../shared/server/rest-api.model';
import { Messages } from '../../shared/messages';

interface AssetResult {
  fileName: string;
  responseData?: Asset;
  errorMessage?: string;
}

@Component({
  selector: 'lc-asset-new-dialog',
  templateUrl: './asset-new-dialog.component.html',
  styleUrls: ['./asset-new-dialog.component.scss']
})
export class AssetNewDialogComponent {

  assetFolder: AssetFolder;

  isDragOver: boolean = false;
  state: 'START' | 'UPLOADING' | 'SUCCESS' | 'FAILURE' = 'START';
  results: Array<AssetResult> = [];

  constructor(
    public dialogRef: MatDialogRef<AssetNewDialogComponent>,
    private assetsResource: AssetsResource
  ) { }

  dragFilesOver(start: boolean): void {
    if (start) {
      if (this.state !== 'UPLOADING') {
        this.state = 'START';
        this.isDragOver = true;
        this.results = [];
      }
    } else {
      this.isDragOver = false;
    }
  }

  dragFilesDropped(droppedFiles: FileList): void {
    if (this.state !== 'UPLOADING' && droppedFiles.length) {
      this.assetFiles(Array.prototype.map.call(droppedFiles, file => file));
    }
  }

  filesSelected(fileChangeEvent: { target: { files: FileList } }): void {
    if (this.state !== 'UPLOADING') {
      this.assetFiles(Array.prototype.map.call(fileChangeEvent.target.files, file => file));
    }
  }

  private assetFiles(files: Array<File>): void {
    this.state = 'UPLOADING';
    this.results = [];
    Observable.forkJoin(
      files.map((file: File) => this.assetFile(file))
    ).subscribe((data: Array<boolean>) => {
      this.state = data.every((status: boolean) => status) ? 'SUCCESS' : 'FAILURE';
    });
  }

  private assetFile(file: File): Observable<boolean> {
    let fileName: string = this.assetsResource.makeSafeFileName(file.name);
    // TODO: How to do this in the right way without <> cast
    return <Observable<boolean>>this.assetsResource.createFile(this.assetFolder.id, { file: file, fileName: fileName, mimeType: file.type })
      .do((response: Asset) => {
        this.results.push({ fileName: fileName, responseData: response });
        return Observable.of<boolean>(true);
      })
      .catch((response: Response) => {
        let errorMessage: string;
        if (response.status == 400) {
          let errors: Array<{ property: string, message: string }> = response.json();
          errorMessage = errors.map((error: { property: string, message: string }) => {
            return Messages.get(error.message);
          }).join(', ');
        } else {
          errorMessage = 'Okänt fel!';
        }
        this.results.push({ fileName: fileName, errorMessage: errorMessage });
        return Observable.of<boolean>(false);
      });
  }
}
