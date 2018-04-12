import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Permission } from './rest-api.model';

export interface PermissionUpdate {
  id: number;
  name: string;
  level: number;
  entityId: number;
  patterns: string;
}

@Injectable()
export class PermissionsResource extends DefaultBaseResource<Permission, PermissionUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'permissions', apiError);
  }

  newInstance(data?: any): Permission {
    return new Permission(data ? data : {});
  }

  updateInstance(from: Permission): PermissionUpdate {
    if (from.id) {
      return <PermissionUpdate>{ id: from.id };
    }
    return <PermissionUpdate>{
      name: from.name,
      level: from.level,
      entityId: IdModel.idOf(from.entity),
      patterns: from.patterns
    };
  }

}
