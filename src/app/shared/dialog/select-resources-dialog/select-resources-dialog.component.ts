import { Component } from '@angular/core';
import { MatDialogRef, MatSelectionListChange } from '@angular/material';
import { Resource, Selectable } from '../../server/rest-api.model';
import { FormControl } from '@angular/forms';
import { SelectEventResourcesMenuComponent } from '../../select-event-resources-menu/select-event-resources-menu.component';

@Component({
  selector: 'lc-select-resources-dialog',
  templateUrl: './select-resources-dialog.component.html',
  styleUrls: ['./select-resources-dialog.component.scss']
})
export class SelectResourcesDialogComponent {

  private selectResourceMenu: SelectEventResourcesMenuComponent;
  private allItems: Array<Selectable<Resource>>;
  items: Array<Selectable<Resource>>;
  noItemsFound: boolean = false;

  searchCtrl: FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SelectResourcesDialogComponent>,
  ) {
    this.searchCtrl.valueChanges.subscribe(value => {
      this.items = this.allItems.filter(item => !value || item.value.name.toLowerCase().includes(value.toLowerCase()));
      this.noItemsFound = this.items.length === 0;
    });
  }

  init(selectResourceMenu: SelectEventResourcesMenuComponent): void {
    this.selectResourceMenu = selectResourceMenu;
    this.items = this.selectResourceMenu.allSelectableItems;
    this.allItems = this.items;
  }

  selectionChange(event: MatSelectionListChange): void {
    this.selectResourceMenu.toggleSelect(event.option.value);
  }

  toggleItem(item: Selectable<Resource>): void {
    this.selectResourceMenu.toggleSelect(item)
  }

  selectNone(): void {
    this.selectResourceMenu.selectNone();
  }
}
