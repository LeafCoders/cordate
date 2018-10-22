import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { IdModel } from './rest-api.model';

export interface ChildResource<PARENT extends IdModel, CHILD extends IdModel> {
  newChildInstance(parent: PARENT, data?: any): CHILD;
}


export class BaseResource<T extends IdModel, U> {

  private listItems: Array<T> = [];
  private selectedItem: T;

  protected listSubject: ReplaySubject<Array<T>> = new ReplaySubject<Array<T>>(1);
  protected selectedSubject: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);

  constructor(
    private findBeforeFn: (a: T, b: T) => boolean,
  ) { }

  protected nextList(): void {
    this.listSubject.next(this.listItems);
  }

  protected nextSelected(): void {
    this.selectedSubject.next(this.selectedItem);
  }

  protected isEmptyList(): boolean {
    return !this.listItems || this.listItems.length === 0;
  }

  protected getItemInLoadedList(itemId: number): T {
    return this.listItems.find(IdModel.idEquals(itemId));
  }

  protected findItemInLoadedList(compareFn: (item: T) => boolean): T {
    return this.listItems.find(compareFn);
  }

  protected setList(items: Array<T>): Array<T> {
    this.listItems = items;
    this.nextList();
    this.nextSelected();
    return this.listItems;
  }

  protected selectItem(item: T): void {
    this.selectedItem = item;
    this.nextSelected();
  }

  protected insertCreated(item: T): T {
    let index: number = this.listItems.findIndex(this.findBeforeFn.bind(undefined, item));
    if (index >= 0) {
      this.listItems.splice(index, 0, item);
    } else {
      this.listItems.push(item);
    }
    this.nextList();
    return item;
  }

  protected replaceUpdated(item: T): T {
    this.removeDeleted(item, false);
    this.insertCreated(item);
    this.nextList();
    return item;
  }

  protected removeDeleted(item: T, callNext: boolean = true): void {
    let index: number = this.listItems.findIndex(IdModel.idEquals(item));
    if (index >= 0) {
      this.listItems.splice(index, 1);
      if (callNext) {
        this.nextList();
      }
    }
  }

}