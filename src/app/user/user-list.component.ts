import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { UsersResource } from '../shared/server/users.resource';
import { User, UserList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends BaseList<User> {

  constructor(
    private usersResource: UsersResource,
    private authPermission: AuthPermissionService,
  ) {
    super(usersResource, () => usersResource.list());
  }

  protected init(): void {
  }

}
