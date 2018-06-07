import { Component } from '@angular/core';
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
  items: Array<IdModel>;

  constructor(
    public dialogRef: MatDialogRef<SingleSelectDialogComponent>,
  ) {
  }

  init(title: string, observable: Observable<Array<IdModel>>, onSelected: (item: IdModel) => void): void {
    this.title = title;
    observable.subscribe(items => this.items = items);
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
