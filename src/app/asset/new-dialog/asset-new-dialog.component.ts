import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AssetsResource } from '../../shared/server/assets.resource';
import { Asset, AssetFolder } from '../../shared/server/rest-api.model';
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
    forkJoin(
      files.map((file: File) => this.assetFile(file))
    ).subscribe((data: Array<boolean>) => {
      this.state = data.every((status: boolean) => status) ? 'SUCCESS' : 'FAILURE';
    });
  }

  private assetFile(file: File): Observable<boolean> {
    const fileName: string = this.assetsResource.makeSafeFileName(file.name);
    return <Observable<boolean>>this.assetsResource.createFile(this.assetFolder.id, { file: file, fileName: fileName, mimeType: file.type }).pipe(
      tap((response: Asset) => {
        this.results.push({ fileName: fileName, responseData: response });
        return of<boolean>(true);
      }),
      catchError((apiError: RestApiError) => {
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
        return of<boolean>(false);
      })
    );
  }
}
