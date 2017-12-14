import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, User } from './rest-api.model';

export interface UserUpdate {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
}

@Injectable()
export class UsersResource extends DefaultBaseResource<User, UserUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService
  ) {
    super(api, 'users', apiError);
  }

  newInstance(data?: any): User {
    return new User(data ? data : {});
  }

  updateInstance(from: User): UserUpdate {
    return <UserUpdate>{ id: from.id };
  }

  adminPermission(item: User): string {
    return `users:admin:${item.id}`;
  }

}
