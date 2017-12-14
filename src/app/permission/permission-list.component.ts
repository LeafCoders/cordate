import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionsResource } from '../shared/server/permissions.resource';
import { Permission, PermissionList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-permission-list',
  templateUrl: './permission-list.component.html'
})
export class PermissionListComponent extends BaseList<Permission> {

  constructor(
    private permissionsResource: PermissionsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(permissionsResource);
  }

  protected init(): void {
  }

}
