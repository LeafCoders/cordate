import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Resource, Selectable } from '../../server/rest-api.model';
import { FormControl } from '@angular/forms';
import { SelectResourcesMenuComponent } from '../../select-resources-menu/select-resources-menu.component';

@Component({
  selector: 'lc-select-resources-dialog',
  templateUrl: './select-resources-dialog.component.html',
  styleUrls: ['./select-resources-dialog.component.scss']
})
export class SelectResourcesDialogComponent {

  private selectResourceMenu: SelectResourcesMenuComponent;
  private allItems: Array<Selectable<Resource>>;
  items: Array<Selectable<Resource>>;
  noItemsFound: boolean = false;

  searchCtrl: FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SelectResourcesMenuComponent>,
  ) {
    this.searchCtrl.valueChanges.subscribe(value => {
      this.items = this.allItems.filter(item => !value || item.value.name.toLowerCase().includes(value.toLowerCase()));
      this.noItemsFound = this.items.length === 0;
    });
  }

  init(selectResourceMenu: SelectResourcesMenuComponent): void {
    this.selectResourceMenu = selectResourceMenu;
    this.items = this.selectResourceMenu.allSelectableItems;
    this.allItems = this.items;
  }

  selectionChange(event: MatSelectionListChange): void {
    this.selectResourceMenu.toggleSelect(event.option.value);
  }

  selectNone(): void {
    this.selectResourceMenu.selectNone();
  }
}
