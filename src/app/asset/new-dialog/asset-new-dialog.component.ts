import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { AssetsResource } from '../../shared/server/assets.resource';
import { Asset, AssetFolder } from '../../shared/server/rest-api.model';
import { Messages } from '../../shared/messages';
import { RestApiError } from '../../shared/server/rest-api-error.model';

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
    const fileName: string = this.assetsResource.makeSafeFileName(file.name);
    return <Observable<boolean>>this.assetsResource.createFile(this.assetFolder.id, { file: file, fileName: fileName, mimeType: file.type })
      .do((response: Asset) => {
        this.results.push({ fileName: fileName, responseData: response });
        return Observable.of<boolean>(true);
      })
      .catch((apiError: RestApiError) => {
        console.log(apiError);
        let errorMessage: string;
        if (!apiError) {
          errorMessage = 'Okänt fel...';
        } else if (apiError.isValidataionError()) {
          errorMessage = apiError.getFirstValidationError();
        } else {
          errorMessage = apiError.getError();
        }
        this.results.push({ fileName: fileName, errorMessage: errorMessage });
        return Observable.of<boolean>(false);
      });
  }
}
