import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, ResourceType, Resource } from './rest-api.model';

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
    apiError: RestApiErrorService,
  ) {
    super(api, 'resourceTypes', apiError);
  }

  newInstance(data?: any): ResourceType {
    return new ResourceType(data ? data : {});
  }

  updateInstance(from: ResourceType): ResourceTypeUpdate {
    return <ResourceTypeUpdate>{ id: from.id };
  }
  /*
  addResource(resourceType: ResourceType, resourceId: number): Observable<void> {
    return this.handleError<void>(
      this.api.create(`api/resourceTypes/${resourceType.id}/resources/${resourceId}`)
        .map((data: Response): void => {
          resourceType.resources = data.json().map(item => new Resource(item));
        })
    );
  }

  removeResource(resourceType: ResourceType, resourceId: number): Observable<void> {
    return this.handleError<void>(
      this.api.delete(`api/resourceTypes/${resourceType.id}/resources/${resourceId}`)
        .map((data: Response): void => {
          resourceType.resources = data.json().map(item => new Resource(item));
        })
    );
  }
  */
}
