import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from '../server/rest-api.service';
import { AuthPermissionService, PermissionResults } from '../../auth/auth-permission.service';
import { EventsResource } from '../server/events.resource';
import { Event, Resource, ResourceList, ResourceRef, ResourceRequirement, User, UserRef, Selectable } from '../server/rest-api.model';
import { MatDialog } from '@angular/material';
import { SelectResourcesDialogComponent } from '../dialog/select-resources-dialog/select-resources-dialog.component';

const MAX_VISIBLE_ITEMS = 10;

@Component({
  selector: 'lc-select-event-resources-menu',
  templateUrl: './select-event-resources-menu.component.html',
})
export class SelectEventResourcesMenuComponent {

  @Input('event') event: Event;
  @Output('eventUpdated') eventUpdatedEmitter: EventEmitter<Event> = new EventEmitter<Event>();

  allowMultiSelect: boolean = true;
  allowSelectAll: boolean = false;
  trueFalseIcons: Array<string> = ['', ''];

  private resourceRequirement: ResourceRequirement;
  allSelectableItems: Array<Selectable<Resource>>;
  visibleSelectableItems: Array<Selectable<Resource>>;
  showViewMore: boolean = false;

  assignPermission: boolean = false;
  managePermission: boolean = false;

  saving: boolean = false;

  constructor(
    private api: RestApiService,
    private eventsResource: EventsResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
  ) { }

  @Input('resourceRequirement')
  set setResourceRequirement(rr: ResourceRequirement) {
    this.resourceRequirement = rr;

    this.trueFalseIcons = this.allowMultiSelect ? ['check_box', 'check_box_outline_blank'] : ['radio_button_checked', 'radio_button_unchecked'];

    this.assignPermission = this.authPermission.isPermitted(this.eventsResource.assignResourceRequirementPermission(this.event, rr.resourceType));
    this.managePermission = this.authPermission.isPermitted(this.eventsResource.manageResourceRequirementsPermission(this.event, rr.resourceType));
  }

  loadResources() {
    if (this.allSelectableItems) {
      this.sortVisibleItems();
      return;
    }
    this.api.read<any[]>(`api/resourceTypes/${this.resourceRequirement.resourceType.id}/resources`)
      .subscribe(data => {
        this.allSelectableItems = data.map(item => <Selectable<Resource>>{ value: new Resource(item), selected: false })
        if (this.resourceRequirement.resources) {
          this.resourceRequirement.resources.forEach((resource: Resource) => {
            let toSelect: Selectable<Resource> = this.allSelectableItems.find((select: Selectable<Resource>) => select.value.id === resource.id);
            if (toSelect) {
              toSelect.selected = true;
            }
          });
        }
        this.sortVisibleItems();
        this.showViewMore = this.allSelectableItems.length > MAX_VISIBLE_ITEMS;
        this.allowSelectAll = this.allowMultiSelect && !this.showViewMore;
      });
  }

  openViewMoreDialog(): void {
    this.dialog.open(SelectResourcesDialogComponent).componentInstance.init(this);
  }

  toggleSelect(select: Selectable<Resource>): void {
    if (this.allowMultiSelect) {
      select.selected = !select.selected;
    } else {
      this.allSelectableItems.forEach((s: Selectable<Resource>) => s.selected = false);
      select.selected = true;
    }
    select.selected ? this.addResource(select.value) : this.removeResource(select.value);
  }

  selectAll(): void {
    this.addResource();
  }

  selectNone(): void {
    this.removeResource();
  }

  removeResourceRequirement(): void {
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
    this.allSelectableItems.forEach((select: Selectable<Resource>): void => {
      select.selected = selectedResources.some(select.value.idEquals.bind(select.value));
    });
  }

  private sortVisibleItems(): void {
    this.allSelectableItems.sort((a, b) => {
      if (a.selected !== b.selected) {
        return a.selected ? -1 : 1;
      }
      return a.value.lastUseTime.isBefore(b.value.lastUseTime) ? -1 : 1;
    });
    this.visibleSelectableItems = this.allSelectableItems.slice(0, MAX_VISIBLE_ITEMS);
  }
}
