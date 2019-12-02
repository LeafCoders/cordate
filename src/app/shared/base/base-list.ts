import { EventEmitter, OnInit, Output, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import { DefaultBaseResource } from '../server/default-base.resource';
import { IdModel } from '../server/rest-api.model';

export abstract class BaseList<ITEM extends IdModel> implements OnInit {

  items: Array<ITEM> = [];

  isLoading: boolean = false;
  failedToLoad: boolean = false;

  @Output('select') selectEmitter: EventEmitter<ITEM> = new EventEmitter<ITEM>();

  @HostBinding('style.display')
  public displayFlex = 'block';

  constructor(
    resource: DefaultBaseResource<ITEM, any>,
    private listLoader: () => Observable<Array<ITEM>> = () => resource.list()
  ) {
  }

  protected abstract init(): void;

  ngOnInit() {
    this.init();
    this.loadList();
  }

  protected loadList(): void {
    this.isLoading = true;
    this.listLoader().subscribe((items: Array<ITEM>) => {
      this.items = items;
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