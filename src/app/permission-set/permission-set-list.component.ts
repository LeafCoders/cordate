import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { PermissionSetsResource } from '../shared/server/permission-sets.resource';
import { PermissionSet } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-permission-set-list',
  templateUrl: './permission-set-list.component.html'
})
export class PermissionSetListComponent extends BaseList<PermissionSet> {

  constructor(
    permissionSetsResource: PermissionSetsResource,
  ) {
    super(permissionSetsResource);
  }

  protected init(): void {
  }

}
