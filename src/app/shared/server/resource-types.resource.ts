import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, ResourceType } from './rest-api.model';

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

}
