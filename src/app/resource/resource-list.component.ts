import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourcesResource } from '../shared/server/resources.resource';
import { Resource, ResourceList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-list',
  templateUrl: './resource-list.component.html'
})
export class ResourceListComponent extends BaseList<Resource> {

  constructor(
    private resourcesResource: ResourcesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(resourcesResource, () => resourcesResource.list());
  }

  protected init(): void {
  }

}
