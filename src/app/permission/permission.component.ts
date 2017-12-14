import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionsResource } from '../shared/server/permissions.resource';
import { Permission } from '../shared/server/rest-api.model';
import { PermissionNewDialogComponent } from './new-dialog/permission-new-dialog.component';

@Component({
  selector: 'lc-permission',
  templateUrl: './permission.component.html'
})
export class PermissionComponent extends BaseContainer<Permission> {

  private newPermissionDialogRef: MatDialogRef<PermissionNewDialogComponent>;

  constructor(
    private permissionsResource: PermissionsResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
  ) {
    super(permissionsResource);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.permissionsResource.createPermission());
  }

  showNewDialog(): void {
    this.newPermissionDialogRef = this.dialog.open(PermissionNewDialogComponent);

    this.newPermissionDialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.openEditorWithNew(new Permission({ level: data.level }));
      }
    });
  }

}
