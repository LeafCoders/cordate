import { OnInit, ViewChild, HostBinding } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DefaultBaseResource } from '../server/default-base.resource';
import { IdModel } from '../server/rest-api.model';
import { DoublePaneComponent } from '../../shared/double-pane/double-pane.component';
import { Router, ActivatedRoute } from '@angular/router';

export abstract class BaseContainer<ITEM extends IdModel> implements OnInit {

  items: Array<ITEM> = [];
  selectedItem: ITEM;

  isLoading: boolean = false;
  failedToLoad: boolean = false;
  allowAddNew: boolean = false;

  @ViewChild(DoublePaneComponent, {static: false})
  private doublePane: DoublePaneComponent;

  @HostBinding('style.display')
  private displayFlex = 'flex';

  constructor(
    private resource: DefaultBaseResource<ITEM, any>,
    private router: Router,
    private route: ActivatedRoute,
    private newIem: () => Observable<ITEM> = () => of(resource.newInstance())
  ) {
  }

  protected abstract init(): void;

  ngOnInit() {
    this.init();
    if (this.route.snapshot.params.itemId) {
      this.resource.get(this.route.snapshot.params.itemId).subscribe(item => this.openEditorWithNew(item));
    }
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
    this.updateNavigation(item ? item.id : undefined);
    this.doublePane.openAside();
  }

  onEditorClose(): void {
    this.updateNavigation(undefined);
    this.doublePane.closeAside();
  }

  private updateNavigation(itemId: number): void {
    this.router.navigate(itemId ? ['.', { 'itemId': itemId }] : ['.', {}], {
      relativeTo: this.route,
    });
  }
}
