import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourcesResource } from '../shared/server/resources.resource';
import { Resource, ResourceType, ResourceTypeRef } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent extends BaseContainer<Resource> {

  resourceTypes: Array<ResourceTypeRef> = [];
  selectedResourceType: ResourceTypeRef;

  constructor(
    private resourcesResource: ResourcesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(resourcesResource, router, route);

    this.resourceTypes.push(new ResourceTypeRef({ name: "Alla" }));
    this.selectedResourceType = this.resourceTypes[0];
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.resourcesResource.createPermission());

    let ids: Array<number> = [];
    this.resourcesResource.list().subscribe((resources: Array<Resource>) => {
      resources.forEach(r => r.resourceTypes.forEach(rt => {
        if (!ids.includes(rt.id)) {
          ids.push(rt.id);
          this.resourceTypes.push(rt);
        }
      }));
    });
  }

  selectResourceType(resourceType: ResourceType): void {
    this.selectedResourceType = resourceType;
  }
}
