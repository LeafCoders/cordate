import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Resource, ResourceTypeRef } from './rest-api.model';

export interface ResourceUpdate {
  id: number;
  name: string;
  description: string;
  userId: number;
}

@Injectable()
export class ResourcesResource extends DefaultBaseResource<Resource, ResourceUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'resources', apiError);
  }

  newInstance(data?: any): Resource {
    return new Resource(data ? data : {});
  }

  updateInstance(from: Resource): ResourceUpdate {
    return <ResourceUpdate>{ id: from.id };
  }

  addResourceType(resource: Resource, resourceTypeId: number): Observable<void> {
    return this.handleError<void>(
      this.api.create<any[]>(`api/resources/${resource.id}/resourceTypes/${resourceTypeId}`)
        .map((data): void => {
          resource.resourceTypes = data.map(item => new ResourceTypeRef(item));
        })
    );
  }

  removeResourceType(resource: Resource, resourceTypeId: number): Observable<void> {
    return this.handleError<void>(
      this.api.delete<any[]>(`api/resources/${resource.id}/resourceTypes/${resourceTypeId}`)
        .map((data): void => {
          resource.resourceTypes = data.map(item => new ResourceTypeRef(item));
        })
    );
  }

}
