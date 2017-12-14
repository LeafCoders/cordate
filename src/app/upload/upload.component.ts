import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { AuthPermissionService } from '../auth/auth-permission.service';
import { UploadNewDialogComponent } from './upload-new-dialog/upload-new-dialog.component';
import { UploadsResource } from '../shared/server/uploads.resource';
import { UploadFoldersResource } from '../shared/server/upload-folders.resource';
import { Upload, UploadList, UploadFolder, UploadFolderList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  private uploadFolders: UploadFolderList = [];
  private uploads: UploadList = [];
  private selectedFolder: UploadFolder;
  private allowAddNew: boolean = false;

  private uploadDialogRef: MatDialogRef<UploadNewDialogComponent>;

  constructor(
    private uploadFoldersResource: UploadFoldersResource,
    private uploadsResource: UploadsResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.uploadFoldersResource.list().subscribe((uploadFolders: UploadFolderList) => {
      this.uploadFolders = uploadFolders;
      this.selectedFolder = this.uploadFolders ? this.uploadFolders[0] : undefined;
      this.selectFolder(this.selectedFolder);
    });
  }

  selectFolder(folder: UploadFolder): void {
    this.selectedFolder = folder;
    this.uploadsResource.list(this.selectedFolder.id).subscribe((uploads: UploadList) => {
      this.uploads = uploads;
    });

    this.allowAddNew = this.authPermission.isPermitted(`assets:create;assetFolders:files:create:${folder.id}`);
  }

  showUploadDialog(): void {
    if (this.allowAddNew && !this.uploadDialogRef) {
      this.uploadDialogRef = this.dialog.open(UploadNewDialogComponent, { width: '80vh' });
      this.uploadDialogRef.componentInstance.uploadFolder = this.selectedFolder;
      this.uploadDialogRef.afterClosed().subscribe(() => {
        this.uploadDialogRef = undefined

        this.uploadsResource.list(this.selectedFolder.id, true).subscribe((uploads: UploadList) => {
          this.uploads = uploads;
        });
      });
    }
  }
}
