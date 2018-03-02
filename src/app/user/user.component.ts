import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { UsersResource } from '../shared/server/users.resource';
import { User } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-user',
  templateUrl: './user.component.html'
})
export class UserComponent extends BaseContainer<User> {

  constructor(
    private usersResource: UsersResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(usersResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.usersResource.createPermission());
  }
}
