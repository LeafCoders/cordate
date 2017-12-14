import { EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DefaultBaseResource } from '../server/default-base.resource';
import { IdModel } from '../server/rest-api.model';

export abstract class BaseList<ITEM extends IdModel> implements OnInit {

  items: Array<ITEM> = [];

  isLoading: boolean = false;
  failedToLoad: boolean = false;

  @Output('select') selectEmitter: EventEmitter<ITEM> = new EventEmitter<ITEM>();

  constructor(
    private resource: DefaultBaseResource<ITEM, any>,
    private listLoader: () => Observable<Array<ITEM>> = () => resource.list()
  ) {
  }

  protected abstract init(): void;

  ngOnInit() {
    this.init();
    this.resource.list().subscribe((items: Array<ITEM>) => {
      this.items = items;
    });
    this.loadList();
  }

  protected loadList(): void {
    this.isLoading = true;
    this.listLoader().subscribe(() => {
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.failedToLoad = true;
    });
  }

  selectItem(item: ITEM): void {
    this.selectEmitter.emit(item);
  }

}