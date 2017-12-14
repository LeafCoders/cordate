import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';
import { ResourceType, ResourceTypeList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-type-list',
  templateUrl: './resource-type-list.component.html'
})
export class ResourceTypeListComponent extends BaseList<ResourceType> {

  constructor(
    private resourceTypesResource: ResourceTypesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(resourceTypesResource, () => resourceTypesResource.list());
  }

  protected init(): void {
  }

}
