import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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
      this.api.create(`api/groups/${group.id}/users/${userId}`)
        .map((data: Response): void => {
          group.users = data.json().map(item => new User(item));
        })
    );
  }

  removeUser(group: Group, userId: number): Observable<void> {
    return this.handleError<void>(
      this.api.delete(`api/groups/${group.id}/users/${userId}`)
        .map((data: Response): void => {
          group.users = data.json().map(item => new User(item));
        })
    );
  }

}
