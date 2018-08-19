import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
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
  ) {
    super(api, 'groups');
  }

  newInstance(data?: any): Group {
    return new Group(data ? data : {});
  }

  updateInstance(from: Group): GroupUpdate {
    return <GroupUpdate>{ id: from.id };
  }

  addUser(group: Group, userId: number): Observable<void> {
    return this.api.create<any[]>(`api/groups/${group.id}/users/${userId}`).pipe(
      map((data): void => {
        group.users = data.map(item => new User(item));
        this.replaceUpdated(group);
      })
    );
  }

  removeUser(group: Group, userId: number): Observable<void> {
    return this.api.delete<any[]>(`api/groups/${group.id}/users/${userId}`).pipe(
      map((data): void => {
        group.users = data.map(item => new User(item));
        this.replaceUpdated(group);
      })
    );
  }

}
