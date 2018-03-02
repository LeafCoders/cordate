import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourcesResource } from '../shared/server/resources.resource';
import { Resource } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent extends BaseContainer<Resource> {

  constructor(
    private resourcesResource: ResourcesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(resourcesResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.resourcesResource.createPermission());
  }
}
