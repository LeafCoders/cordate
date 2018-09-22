import { Component, Input } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { ResourcesResource } from '../shared/server/resources.resource';
import { Resource, ResourceTypeRef } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-list',
  templateUrl: './resource-list.component.html'
})
export class ResourceListComponent extends BaseList<Resource> {

  private filterResourceType: ResourceTypeRef;
  resources: Array<Resource> = [];

  constructor(
    private resourcesResource: ResourcesResource,
  ) {
    super(resourcesResource, () => resourcesResource.list());
  }

  protected init(): void {
    this.resourcesResource.list().subscribe((resources: Array<Resource>) => {
      this.filterResources(resources);
    });

  }

  @Input('filterResourceType')
  set setFilterResourceType(resourceType: ResourceTypeRef) {
    this.filterResourceType = resourceType;
    this.filterResources(this.items);
  };

  private filterResources(resources: Array<Resource>): void {
    if (this.filterResourceType.id) {
      this.resources = resources.filter(r => r.resourceTypes.some(rt => rt.idEquals(this.filterResourceType)));
    } else {
      this.resources = resources;
    }
  }

}
