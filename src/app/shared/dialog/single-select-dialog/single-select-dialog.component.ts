import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { IdModel } from '../../server/rest-api.model';

@Component({
  selector: 'lc-single-select-dialog',
  templateUrl: './single-select-dialog.component.html',
  styleUrls: ['./single-select-dialog.component.scss']
})
export class SingleSelectDialogComponent {

  title: string;
  allItems: Array<IdModel>;
  items: Array<IdModel>;
  noItemsFound: boolean = false;

  searchCtrl: FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SingleSelectDialogComponent>,
  ) {
  }

  init(title: string, observable: Observable<Array<IdModel>>, onSelected: (item: IdModel) => void): void {
    this.title = title;
    observable.subscribe(items => {
      this.allItems = items;
      this.items = items;
      this.searchCtrl.valueChanges.subscribe(value => {
        this.items = this.allItems.filter(item => !value || item.asText().toLowerCase().includes(value.toLowerCase()));
        this.noItemsFound = this.items.length === 0;
      });

    });
    this.dialogRef.afterClosed().subscribe((selectedItem: IdModel) => {
      if (selectedItem) {
        onSelected(selectedItem);
      }
    });
  }

  selectItem(item: IdModel): void {
    this.dialogRef.close(item);
  }

}
