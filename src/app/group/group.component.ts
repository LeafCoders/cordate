import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { GroupsResource } from '../shared/server/groups.resource';
import { Group } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-group',
  templateUrl: './group.component.html'
})
export class GroupComponent extends BaseContainer<Group> {

  constructor(
    private groupsResource: GroupsResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(groupsResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.groupsResource.createPermission());
  }
}
