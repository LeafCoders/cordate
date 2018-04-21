import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  protected insertCreated(user: T): T {
    let index: number = this.listItems.findIndex(this.findBeforeFn.bind(undefined, user));
    if (index >= 0) {
      this.listItems.splice(index, 0, user);
    } else {
      this.listItems.push(user);
    }
    this.nextList();
    return user;
  }

  protected replaceUpdated(user: T): T {
    this.removeDeleted(user, false);
    this.insertCreated(user);
    this.nextList();
    return user;
  }

  protected removeDeleted(user: T, callNext: boolean = true): void {
    let index: number = this.listItems.findIndex(IdModel.idEquals(user));
    if (index >= 0) {
      this.listItems.splice(index, 1);
      if (callNext) {
        this.nextList();
      }
    }
  }

}