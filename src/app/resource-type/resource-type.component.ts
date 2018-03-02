import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';
import { ResourceType } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-type',
  templateUrl: './resource-type.component.html'
})
export class ResourceTypeComponent extends BaseContainer<ResourceType> {

  constructor(
    private resourceTypesResource: ResourceTypesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(resourceTypesResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.resourceTypesResource.createPermission());
  }
}
