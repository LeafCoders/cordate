import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import * as moment from 'moment';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { EventsResource, EventUpdate } from '../shared/server/events.resource';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';
import { Event, EventTypeRef, TimeRange, ResourceTypeList, ResourceTypeRef, ResourceRequirement, Resource, ResourceType } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-event-editor',
  templateUrl: './event-editor.component.html'
})
export class EventEditorComponent extends BaseEditor<Event, EventUpdate> {

  timeState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  eventTypeState: EditorState = new EditorState();

  private currentTabIndex: number = 0;

  // Resouce
  private allResourceTypes: ResourceTypeList = [];
  notAddedResourceTypes: ResourceTypeList = [];
  permissionAddRequirements: boolean = false;

  constructor(
    private authPermission: AuthPermissionService,
    private eventsResource: EventsResource,
    private resourceTypeResource: ResourceTypesResource,
  ) {
    super(eventsResource);

    this.resourceTypeResource.list().subscribe(resourceTypes => {
      this.allResourceTypes = resourceTypes;
      this.refreshAvailableAddResourceTypes();
    });
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.timeState, this.titleState, this.descriptionState, this.eventTypeState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.eventsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.eventsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  protected afterSetEditorItem(event: Event): void {
    this.refreshAvailableAddResourceTypes();
  }

  onTabSelectChange(changeEvent: MatTabChangeEvent): void {
    this.currentTabIndex = changeEvent.index;
    //this.initEducationTab();
  }

  addResourceRequirement(resourceType: ResourceType): void {
    if (this.item.id) {
      this.eventsResource.addResourceRequirement(this.item, resourceType).subscribe(() => {
        this.refreshAvailableAddResourceTypes();
        // this.updatedEmitter.emit(this.item);
      });
    } else {
      this.item.resourceRequirements.push(ResourceRequirement.fromResourceType(resourceType));
      this.refreshAvailableAddResourceTypes();
    }
  }

  removeResourceRequirement(resourceRequirement: ResourceRequirement): void {
    let doRemove = () => {
      let index: number = this.item.resourceRequirements.findIndex((rr: ResourceRequirement) => resourceRequirement.resourceType.idEquals(rr.resourceType));
      if (index >= 0) {
        this.item.resourceRequirements.splice(index, 1);
      }
      this.refreshAvailableAddResourceTypes();
    };

    if (this.item.id) {
      this.eventsResource.removeResourceRequirement(this.item, resourceRequirement).subscribe(() => {
        doRemove();
        // this.updatedEmitter.emit(this.item);
      });
    } else {
      doRemove();
    }
  }

  setResource(userResource: Resource, users: void): void {
    //TODO: userResource.users = users;
    if (this.item.id) {
      //      this.updatedEmitter.emit(this.event);
    }
  }

  private refreshAvailableAddResourceTypes(): void {
    if (this.item) {
      this.notAddedResourceTypes = this.allResourceTypes.filter(resourceType => {
        if (!this.item.resourceRequirements.find((rr: ResourceRequirement) => rr.resourceType.id === resourceType.id)) {
          if (this.authPermission.isPermitted(this.eventsResource.manageResourceRequirementsPermission(this.item, resourceType))) {
            return true;
          }
        }
        return false;
      });
    }
  }

  setTime(time: TimeRange): void {
    this.setValue(this.timeState,
      (item: EventUpdate) => {
        item.startTime = time.start ? time.start.toJSON() : undefined;
        item.endTime = time.end ? time.end.toJSON() : undefined;
      },
      () => {
        this.item.startTime = time.start;
        this.item.endTime = time.end;
      }
    );
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: EventUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: EventUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setEventType(eventType: EventTypeRef): void {
    this.setValue(this.eventTypeState,
      (item: EventUpdate) => item.eventTypeId = eventType.id,
      () => this.item.eventType = eventType
    );
  }
}
