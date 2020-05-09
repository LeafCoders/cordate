import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Permission, PermissionSet } from './rest-api.model';

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
  ) {
    super(api, 'permissions');
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

  addPermissionSet(permission: Permission, resourceTypeId: number): Observable<void> {
    return this.api.create<any[]>(`api/permissions/${permission.id}/permissionSets/${resourceTypeId}`).pipe(
      map((data): void => {
        permission.permissionSets = data.map(item => new PermissionSet(item));
        this.replaceUpdated(permission);
      })
    );
  }

  removePermissionSet(permission: Permission, permissionSetId: number): Observable<void> {
    return this.api.delete<any[]>(`api/permissions/${permission.id}/permissionSets/${permissionSetId}`).pipe(
      map((data): void => {
        permission.permissionSets = data.map(item => new PermissionSet(item));
        this.replaceUpdated(permission);
      })
    );
  }
}
