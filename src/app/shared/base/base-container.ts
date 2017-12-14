import { OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DefaultBaseResource } from '../server/default-base.resource';
import { IdModel } from '../server/rest-api.model';
import { DoublePaneComponent } from '../../shared/double-pane/double-pane.component';

export abstract class BaseContainer<ITEM extends IdModel> implements OnInit {

  items: Array<ITEM> = [];
  selectedItem: ITEM;

  isLoading: boolean = false;
  failedToLoad: boolean = false;
  allowAddNew: boolean = false;

  @ViewChild(DoublePaneComponent)
  private doublePane: DoublePaneComponent;

  constructor(
    private resource: DefaultBaseResource<ITEM, any>,
    private newIem: () => Observable<ITEM> = () => Observable.of(resource.newInstance())
  ) {
  }

  protected abstract init(): void;

  ngOnInit() {
    this.init();
  }

  openEditorWithNew(newItem?: ITEM): void {
    if (newItem) {
      this.onItemSelected(newItem);
    } else {
      this.newIem().subscribe((item: ITEM) => {
        this.onItemSelected(item);
      });
    }
  }

  onItemSelected(item: ITEM): void {
    this.selectedItem = item;
    this.doublePane.openAside();
  }

  onEditorClose(): void {
    this.doublePane.closeAside();
  }

}