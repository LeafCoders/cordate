import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { RestApiService } from '../server/rest-api.service';
import { AuthPermissionService, PermissionResults } from '../../auth/auth-permission.service';
import { EventsResource } from '../server/events.resource';
import { Event, Resource, ResourceList, ResourceRef, ResourceRequirement, User, UserRef, ObjectRefsAndText } from '../server/rest-api.model';

interface ResourceSelect {
  resource: Resource;
  selected: boolean;
}

@Component({
  selector: 'lc-user-resource-menu',
  templateUrl: './user-resource-menu.component.html',
})
export class UserResourceMenuComponent {

  @Input('event') event: Event;
  @Input('permission') permission: boolean;
  @Output('eventUpdated') eventUpdatedEmitter: EventEmitter<Event> = new EventEmitter<Event>();
  //  @Output() removeResourceRequirement: EventEmitter<void> = new EventEmitter<void>();

  allowMultiSelect: boolean;
  trueFalseIcons: Array<string> = ['', ''];

  resourceRequirement: ResourceRequirement;
  resources: Array<ResourceSelect>;

  assignPermission: boolean = false;
  managePermission: boolean = false;

  saving: boolean = false;

  constructor(
    private api: RestApiService,
    private eventsResource: EventsResource,
    private authPermission: AuthPermissionService,
  ) { }

  @Input('resourceRequirement')
  set setResourceRequirement(rr: ResourceRequirement) {
    this.resourceRequirement = rr;

    this.api.read(`api/resourceTypes/${rr.resourceType.id}/resources`)
      .subscribe(data => {
        this.resources = data.json().map(item => <ResourceSelect>{ resource: new Resource(item), selected: false })
        if (rr.resources) {
          rr.resources.forEach((resource: Resource) => {
            let toSelect: ResourceSelect = this.resources.find((select: ResourceSelect) => select.resource.id === resource.id);
            if (toSelect) {
              toSelect.selected = true;
            }
          });
        }
        this.allowMultiSelect = true;
        this.trueFalseIcons = this.allowMultiSelect ? ['check_box', 'check_box_outline_blank'] : ['radio_button_checked', 'radio_button_unchecked'];

        this.assignPermission = this.authPermission.isPermitted(this.eventsResource.assignResourceRequirementPermission(this.event, rr.resourceType));
        this.managePermission = this.authPermission.isPermitted(this.eventsResource.manageResourceRequirementsPermission(this.event, rr.resourceType));
      });
  }

  toggleSelect(select: ResourceSelect): void {
    if (this.allowMultiSelect) {
      select.selected = !select.selected;
    } else {
      this.resources.forEach((s: ResourceSelect) => s.selected = false);
      select.selected = true;
    }
    select.selected ? this.addResource(select.resource) : this.removeResource(select.resource);
  }

  selectAll(): void {
    this.addResource();
  }

  clear(): void {
    this.removeResource();
  }

  remove(): void {
    if (this.event && this.event.id) {
      this.perform(this.eventsResource.removeResourceRequirement(this.event, this.resourceRequirement));
    }
  }

  private addResource(resource?: Resource): void {
    if (this.event && this.event.id) {
      this.perform(this.eventsResource.addResource(this.event, this.resourceRequirement, resource));
    }
  }

  private removeResource(resource?: Resource): void {
    if (this.event && this.event.id) {
      this.perform(this.eventsResource.removeResource(this.event, this.resourceRequirement, resource));
    }
  }

  private perform(action: Observable<void>): void {
    window.setTimeout(() => this.saving = true, 1);
    action.subscribe(() => {
      this.saving = false;
      this.updateSelections(this.resourceRequirement.resources);
      this.eventUpdatedEmitter.emit(this.event);
    }, () => {
      this.saving = false;
    });
  }

  private updateSelections(selectedResources: Array<ResourceRef>): void {
    this.resources.forEach((select: ResourceSelect): void => {
      select.selected = selectedResources.some(select.resource.idEquals.bind(select.resource));
    });
  }
}
