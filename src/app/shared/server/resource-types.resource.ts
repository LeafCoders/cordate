import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { ResourceType } from './rest-api.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResourceTypeUpdate {
  id: number;
  idAlias: string;
  name: string;
  description: string;
}

@Injectable()
export class ResourceTypesResource extends DefaultBaseResource<ResourceType, ResourceTypeUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'resourceTypes', (a, b) => a.displayOrder < b.displayOrder);
  }

  newInstance(data?: any): ResourceType {
    return new ResourceType(data ? data : {});
  }

  updateInstance(from: ResourceType): ResourceTypeUpdate {
    return <ResourceTypeUpdate>{ id: from.id };
  }

  moveResourceType(item: ResourceType, toItemId: number): Observable<Array<ResourceType>> {
    return this.api.update<Array<ResourceType>>(`api/resourceTypes/${item.id}/moveTo/${toItemId}`).pipe(
      map((data): Array<ResourceType> => {
        return this.setList(data.map(item => this.newInstance(item)));
      })
    );
  }

}
