import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionSetsResource } from '../shared/server/permission-sets.resource';
import { PermissionSet } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-permission-set',
  templateUrl: './permission-set.component.html'
})
export class PermissionSetComponent extends BaseContainer<PermissionSet> {

  constructor(
    private permissionSetsResource: PermissionSetsResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(permissionSetsResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.permissionSetsResource.createPermission());
  }
}
