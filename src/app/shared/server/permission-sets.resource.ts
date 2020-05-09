import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, PermissionSet } from './rest-api.model';

export interface PermissionSetUpdate {
  id: number;
  name: string;
  patterns: string;
}

@Injectable()
export class PermissionSetsResource extends DefaultBaseResource<PermissionSet, PermissionSetUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'permissionSets');
  }

  newInstance(data?: any): PermissionSet {
    return new PermissionSet(data ? data : {});
  }

  updateInstance(from: PermissionSet): PermissionSetUpdate {
    if (from.id) {
      return <PermissionSetUpdate>{ id: from.id };
    }
    return <PermissionSetUpdate>{
      name: from.name,
      patterns: from.patterns
    };
  }

}
