import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';
import { ResourceType } from '../shared/server/rest-api.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'lc-resource-type-list',
  templateUrl: './resource-type-list.component.html',
  styleUrls: ['./resource-type-list.component.scss']
})
export class ResourceTypeListComponent extends BaseList<ResourceType> {

  constructor(
    private resourceTypesResource: ResourceTypesResource
  ) {
    super(resourceTypesResource, () => resourceTypesResource.list());
  }

  protected init(): void {
  }

  public resourceTypeDrop(event: CdkDragDrop<ResourceType, ResourceType>): void {
    const moveItem: ResourceType = event.item.data;
    const toItem: ResourceType = this.items[event.currentIndex];
    if (moveItem === toItem) {
      return;
    }

    // Perform move at server
    this.resourceTypesResource.moveResourceType(moveItem, toItem.id).subscribe();
  }

}
