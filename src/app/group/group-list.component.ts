import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { GroupsResource } from '../shared/server/groups.resource';
import { Group, GroupList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-group-list',
  templateUrl: './group-list.component.html'
})
export class GroupListComponent extends BaseList<Group> {

  constructor(
    private groupsResource: GroupsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(groupsResource, () => groupsResource.list());
  }

  protected init(): void {
  }

}
