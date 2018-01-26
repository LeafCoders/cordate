import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/debounceTime';

import { BaseResource } from './base.resource';
import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { IdModel } from './rest-api.model';

export abstract class DefaultBaseResource<T extends IdModel, U> extends BaseResource<T, U> {

  private lastRefreshTime: number = 0;
  protected parentName: string = undefined;
  protected parentItem: IdModel = undefined;
  protected listParams: Object = undefined;

  protected requestListSubject: BehaviorSubject<void> = undefined;

  constructor(
    protected api: RestApiService,
    private name: string,
    apiError: RestApiErrorService,
    findBeforeFn?: (a: T, b: T) => boolean,
  ) {
    super(apiError, findBeforeFn ? findBeforeFn : (a: T, b: T) => a.asText().localeCompare(b.asText()) < 0);
  }

  abstract newInstance(data?: any): T;
  abstract updateInstance(from: T): U;

  setParent<T extends IdModel>(parentName: string, parentItem: T): void {
    this.parentName = parentName;
    this.parentItem = parentItem;
    this.refreshList(true);
  }

  setListParams(params: Object): void {
    const current = Object.values(this.listParams ? this.listParams : []);
    const next = Object.values(params ? params : []);
    const notEqual: boolean = current.length !== next.length || current.some((v, index) => v !== next[index]);
    if (notEqual) {
      this.listParams = params;
      this.refreshList(true);
    }
  }

  select(item: T): void {
    this.selectItem(item);
  }

  currentSelected(): Subject<T> {
    return this.selectedSubject;
  }

  list(): Subject<Array<T>> {
    this.refreshList();
    return this.listSubject;
  };

  protected refreshList(forceRefresh: boolean = false): void {
    const currentTime: number = new Date().getTime();
    if (forceRefresh || this.isEmptyList() || currentTime - this.lastRefreshTime > 60 * 1000) {
      this.lastRefreshTime = currentTime;
      this.getRequestListSubject().next(undefined);
    }
  }

  private getRequestListSubject(): BehaviorSubject<void> {
    if (!this.requestListSubject) {
      this.requestListSubject = new BehaviorSubject<void>(undefined);
      this.requestListSubject
        .debounceTime(50)
        .subscribe(() => {
          this.requestList().subscribe();
        });
    }
    return this.requestListSubject;
  }

  private requestList(): Observable<Array<T>> {
    return this.handleError<Array<T>>(
      this.api.read(this.apiPath(), this.listParams)
        .map((data: Response): Array<T> => {
          console.log(this.name, 'Got DATA');
          this.lastRefreshTime = new Date().getTime();
          return this.setList(data.json().map(item => this.newInstance(item)));
        })
    );
  }

  get(itemId: number): Observable<T> {
    let item: T = this.getItemInLoadedList(itemId);
    if (item) {
      return Observable.of(item);
    }
    return this.handleError<T>(
      this.api.read(this.apiPath(itemId))
        .map((data: Response): T => {
          return this.newInstance(data.json());
        })
    );
  }

  create(item: U): Observable<T> {
    return this.handleError<T>(
      this.api.create(this.apiPath(), {}, item)
        .map((data: Response): T => {
          return this.insertCreated(this.newInstance(data.json()));
        })
    );
  }

  update(itemId: number, itemUpdate: U): Observable<T> {
    return this.handleError<T>(
      this.api.update(this.apiPath(itemId), {}, itemUpdate)
        .map((data: Response): T => {
          return this.replaceUpdated(this.newInstance(data.json()));
        })
    );
  }

  delete(itemId: number, item: T): Observable<void> {
    return this.handleError<void>(
      this.api.delete(this.apiPath(itemId))
        .map((): void => {
          this.removeDeleted(item);
        })
    );
  }

  createPermission(): string {
    return `${this.name}.create`;
  }

  updatePermission(item: T): string {
    return `${this.name}.update:${item.id}`;
  }

  deletePermission(item: T): string {
    return `${this.name}.delete:${item.id}`;
  }

  private apiPath(itemId?: number): string {
    if (this.parentName && this.parentItem) {
      return `api/${this.parentName}/${this.parentItem.id}/${this.name}` + (itemId ? `/${itemId}` : '');
    }
    return `api/${this.name}` + (itemId ? `/${itemId}` : '');
  }
}