import { Component, OnInit, ViewChild } from '@angular/core';

import { DoublePaneComponent } from '../shared/double-pane/double-pane.component';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { TextValuesResource } from '../shared/server/text-values.resource';
import { TextValue, TextValueList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-text-value',
  templateUrl: './text-value.component.html',
  styleUrls: ['./text-value.component.scss']
})
export class TextValueComponent implements OnInit {

  textValues: TextValueList = [];
  selectedTextValue: TextValue;

  isLoading: boolean = false;
  failedToLoad: boolean = false;
  allowAddNew: boolean = true;

  @ViewChild(DoublePaneComponent, {static: false})
  doublePane: DoublePaneComponent;

  constructor(
    private textValuesResource: TextValuesResource,
    private authPermission: AuthPermissionService
  ) { }

  ngOnInit() {
    this.loadTextValues();
  }

  newTextValue(): void {
    let textValue: TextValue = new TextValue({});
    this.selectedTextValue = textValue;
    this.doublePane.openAside(true);
  }

  selectTextValue(textValue: TextValue): void {
    this.doublePane.openAside();
    this.selectedTextValue = this.textValuesResource.getCached(textValue.id);
  }

  textValueUpdated(updatedTextValue: TextValue): void {
    this.textValuesResource.refreshCache(updatedTextValue);
    this.loadTextValues();
  }

  private loadTextValues(): void {
    this.textValuesResource.list().subscribe((textValues: TextValueList) => {
      this.textValues = textValues;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.failedToLoad = true;
    });
  }

}
