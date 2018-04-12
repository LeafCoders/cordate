import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Group, User } from './rest-api.model';

export interface GroupUpdate {
  id: number;
  idAlias: string;
  name: string;
  description: string;
}

@Injectable()
export class GroupsResource extends DefaultBaseResource<Group, GroupUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'groups', apiError);
  }

  newInstance(data?: any): Group {
    return new Group(data ? data : {});
  }

  updateInstance(from: Group): GroupUpdate {
    return <GroupUpdate>{ id: from.id };
  }

  addUser(group: Group, userId: number): Observable<void> {
    return this.handleError<void>(
      this.api.create<any[]>(`api/groups/${group.id}/users/${userId}`)
        .map((data): void => {
          group.users = data.map(item => new User(item));
        })
    );
  }

  removeUser(group: Group, userId: number): Observable<void> {
    return this.handleError<void>(
      this.api.delete<any[]>(`api/groups/${group.id}/users/${userId}`)
        .map((data): void => {
          group.users = data.map(item => new User(item));
        })
    );
  }

}
