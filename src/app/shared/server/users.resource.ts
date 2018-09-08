import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
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
  ) {
    super(api, 'users');
  }

  newInstance(data?: any): User {
    return new User(data ? data : {});
  }

  updateInstance(from: User): UserUpdate {
    return <UserUpdate>{ id: from.id };
  }

}
