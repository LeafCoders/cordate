import { Observable, Observer, Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { BaseResource } from './base.resource';
import { RestApiService, RequestParams } from './rest-api.service';
import { IdModel } from './rest-api.model';

export abstract class DefaultBaseResource<T extends IdModel, U> extends BaseResource<T, U> {

  private lastRefreshTime: number = 0;
  protected parentName: string = undefined;
  protected parentItem: IdModel = undefined;
  protected listParams: RequestParams = undefined;

  protected requestListSubject: BehaviorSubject<void> = undefined;

  constructor(
    protected api: RestApiService,
    private name: string,
    findBeforeFn?: (a: T, b: T) => boolean,
  ) {
    super(findBeforeFn ? findBeforeFn : (a: T, b: T) => a.asText().localeCompare(b.asText()) < 0);
  }

  abstract newInstance(data?: any): T;
  abstract updateInstance(from: T): U;

  setParent<T extends IdModel>(parentName: string, parentItem: T): void {
    this.parentName = parentName;
    this.parentItem = parentItem;
    this.refreshList(true);
  }

  setListParams(params: RequestParams): void {
    const current = Object.values(this.listParams ? this.listParams : []);
    const next = Object.values(params ? params : []);
    const notEqual: boolean = current.length !== next.length || current.some((v, index) => v !== next[index]);
    if (notEqual) {
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])
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

  listOnce(): Observable<Array<T>> {
    this.refreshList();
    return Observable.create((observer: Observer<Array<T>>) => {
      let subscription: Subscription = this.listSubject.subscribe(items => {
        observer.next(items);
      }, undefined, () => {
        observer.complete();
        subscription.unsubscribe();
      });
    });
  };

  listOnceFor(listParams: RequestParams): Observable<Array<T>> {
    return this.api.read<Array<T>>(this.apiPath(), listParams).pipe(
      map((data): Array<T> => {
        return data.map(item => this.newInstance(item));
      })
    );
  }

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
      this.requestListSubject.pipe(debounceTime(50))
        .subscribe(() => {
          this.requestList().subscribe();
        });
    }
    return this.requestListSubject;
  }

  private requestList(): Observable<Array<T>> {
    return this.api.read<any[]>(this.apiPath(), this.listParams).pipe(
      map((data): Array<T> => {
        this.lastRefreshTime = new Date().getTime();
        return this.setList(data.map(item => this.newInstance(item)));
      })
    );
  }

  get(itemId: number): Observable<T> {
    let item: T = this.getItemInLoadedList(itemId);
    if (item) {
      return of(item);
    }
    return this.api.read<Object>(this.apiPath(itemId)).pipe(
      map((data): T => {
        return this.newInstance(data);
      })
    );
  }

  create(item: U): Observable<T> {
    return this.api.create<Object>(this.apiPath(), {}, item).pipe(
      map((data): T => {
        return this.insertCreated(this.newInstance(data));
      })
    );
  }

  update(itemId: number, itemUpdate: U): Observable<T> {
    return this.api.update<Object>(this.apiPath(itemId), {}, itemUpdate).pipe(
      map((data): T => {
        return this.replaceUpdated(this.newInstance(data));
      })
    );
  }

  delete(itemId: number, item: T): Observable<void> {
    return this.api.delete<Object>(this.apiPath(itemId)).pipe(
      map((): void => {
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