import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from '../server/rest-api.service';
import { AuthPermissionService } from '../../auth/auth-permission.service';
import { Resource, ResourceRef, Selectable } from '../server/rest-api.model';
import { MatDialog } from '@angular/material';
import { SelectResourcesDialogComponent } from '../dialog/select-resources-dialog/select-resources-dialog.component';
import { ResourcesUpdater } from '../server/resources-updater';

const MAX_VISIBLE_ITEMS = 10;

@Component({
  selector: 'lc-select-resources-menu',
  templateUrl: './select-resources-menu.component.html',
})
export class SelectResourcesMenuComponent {

  //  @Input('value') value: MODEL;
  @Output('valueUpdated') valueUpdatedEmitter: EventEmitter<void> = new EventEmitter<void>();

  allowMultiSelect: boolean = true;
  allowSelectAll: boolean = false;
  trueFalseIcons: Array<string> = ['', ''];

  private resourcesUpdater: ResourcesUpdater;
  allSelectableItems: Array<Selectable<Resource>>;
  visibleSelectableItems: Array<Selectable<Resource>>;
  showViewMore: boolean = false;

  assignPermission: boolean = false;
  managePermission: boolean = false;

  saving: boolean = false;

  constructor(
    private api: RestApiService,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
  ) { }

  @Input('resourcesUpdater')
  set setResourcesUpdater(resourcesUpdater: ResourcesUpdater) {
    this.resourcesUpdater = resourcesUpdater;

    this.trueFalseIcons = this.allowMultiSelect ? ['check_box', 'check_box_outline_blank'] : ['radio_button_checked', 'radio_button_unchecked'];

    this.assignPermission = this.authPermission.isPermitted(this.resourcesUpdater.assignPermission());
    this.managePermission = this.authPermission.isPermitted(this.resourcesUpdater.managePermission());
  }

  loadResources() {
    if (this.allSelectableItems) {
      this.sortVisibleItems();
      return;
    }
    this.api.read<any[]>(`api/resourceTypes/${this.resourcesUpdater.getResourceType().id}/resources`)
      .subscribe(data => {
        this.allSelectableItems = data.map(item => <Selectable<Resource>>{ value: new Resource(item), selected: false })
        if (this.resourcesUpdater.getSelectedResources()) {
          this.resourcesUpdater.getSelectedResources().forEach((resource: Resource | ResourceRef) => {
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
    this.perform(this.resourcesUpdater.removeResourceRequirement());
  }

  private addResource(resource?: Resource): void {
    this.perform(this.resourcesUpdater.addResource(resource));
  }

  private removeResource(resource?: Resource): void {
    this.perform(this.resourcesUpdater.removeResource(resource));
  }

  private perform(action: Observable<void>): void {
    if (action) {
      window.setTimeout(() => this.saving = true, 1);
      action.subscribe(() => {
        this.saving = false;
        this.updateSelections(this.resourcesUpdater.getSelectedResources());
        this.valueUpdatedEmitter.emit();
      }, () => {
        this.saving = false;
      });
    } else {
      this.updateSelections(this.resourcesUpdater.getSelectedResources());
      this.valueUpdatedEmitter.emit();
    }
  }

  private updateSelections(selectedResources: Array<Resource | ResourceRef>): void {
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
