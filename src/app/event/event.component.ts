import { Component, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventsResource } from '../shared/server/events.resource';
import { EventTypesResource } from '../shared/server/event-types.resource';
import { Event, EventList, ResourceRequirement, ResourceTypeRef, EventTypeList, EventType } from '../shared/server/rest-api.model';
import { EventNewDialogComponent } from './new-dialog/event-new-dialog.component';
import { FilterItem, NONE_FILTER, TODAY, LAST_WEEK, ShowFrom } from './event-common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'lc-event',
  templateUrl: './event.component.html'
})
export class EventComponent extends BaseContainer<Event> implements OnDestroy {

  // Filters
  weekView: boolean = true;
  filters: Array<FilterItem> = [NONE_FILTER];
  selectedFilter: FilterItem = NONE_FILTER;
  allShowFrom: Array<ShowFrom> = [TODAY, LAST_WEEK];
  selectedShowFrom: ShowFrom = TODAY;

  private rosetteUrl: string = environment.rosetteUrl;
  private newEventDialogRef: MatDialogRef<EventNewDialogComponent>;
  private sseConnection: EventSource;
  private sseIsAlive: boolean = false;
  private sseTimeoutId: number = undefined;

  constructor(
    private eventsResource: EventsResource,
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private jwtHelperService: JwtHelperService,
    private ngZone: NgZone,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(eventsResource, router, route);
    this.selectShowFrom(this.selectedShowFrom);

    this.sseTimeoutId = window.setTimeout(() => this.connectServerSentEvent(), 10000 / 10);
  }

  protected init(): void {
    this.setupShowFromList();
    this.eventsResource.list().subscribe((events: EventList) => {
      this.buildFilterItems(events);
    });
    this.eventTypesResource.listOnce().subscribe((eventTypes: EventTypeList) => {
      this.allowAddNew = eventTypes.some((eventType: EventType) => {
        return this.authPermission.isPermitted(this.eventsResource.createPermission(eventType));
      });
    });
  }

  ngOnDestroy(): void {
    if (this.sseConnection) {
      this.sseConnection.close();
    }
    window.clearTimeout(this.sseTimeoutId);
  }

  private connectServerSentEvent() {
    this.sseTimeoutId = undefined;
    this.sseIsAlive = false;
    this.sseConnection = new EventSource(
      `${this.rosetteUrl}api/sse/events?X-AUTH-TOKEN=${this.jwtHelperService.tokenGetter()}`,
      { withCredentials: true }
    );

    this.sseConnection.onmessage = (e) => {
      const sseEvent: any = JSON.parse(e.data);
      if (sseEvent !== undefined && sseEvent.type !== undefined && sseEvent.data !== undefined) {
        if (sseEvent.type === 'ping') {
          this.sseIsAlive = true;
        } else if (sseEvent.type === 'event') {
          const event: Event = new Event(sseEvent.data);
          this.eventsResource.replaceUpdated(event);
          this.ngZone.run(() => {
            this.onItemSelected(event);
            this.snackBar.open('Uppdaterad', undefined, { duration: 500 });
          });
        }
      }
    };

    this.sseConnection.onerror = (e) => {
      if (this.sseIsAlive) {
        if (this.sseConnection.readyState !== EventSource.CLOSED) {
          this.sseConnection.close();
          this.sseTimeoutId = window.setTimeout(() => this.connectServerSentEvent(), 1000);
        }
      } else {
        if (this.sseConnection.readyState !== EventSource.CLOSED) {
          this.sseConnection.close();
        }
        this.sseConnection = undefined;
      }
    }
  }

  toggleView() {
    this.weekView = !this.weekView;
  }

  selectFilter(filterToSelect: FilterItem): void {
    this.selectedFilter = filterToSelect;
  }

  selectShowFrom(showFromToSelect: ShowFrom): void {
    this.selectedShowFrom = showFromToSelect;
    this.eventsResource.setListParams({
      from: showFromToSelect.from ? showFromToSelect.from.toJSON() : undefined,
      before: showFromToSelect.before ? showFromToSelect.before.toJSON() : undefined
    });
  }

  showNewDialog(fromDate: moment.Moment = undefined): void {
    if (fromDate === undefined) {
      fromDate = moment().startOf('week');
    }
    this.newEventDialogRef = this.dialog.open(EventNewDialogComponent);
    this.newEventDialogRef.componentInstance.startDate = fromDate;

    this.newEventDialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.openEditorWithNew(Event.createForEventType(data.eventType, data.startDate));
      }
    });
  }

  private buildFilterItems(events: EventList): void {
    let resourceTypes: { [key: string]: ResourceTypeRef } = {};
    this.filters = [NONE_FILTER];
    events.forEach((event: Event) => {
      event.resourceRequirements.forEach((rr: ResourceRequirement) => {
        if (resourceTypes[rr.resourceType.id] === undefined) {
          resourceTypes[rr.resourceType.id] = rr.resourceType;
          if (this.authPermission.isPermitted(`events:update:resourceTypes:${rr.resourceType.id}`)) {
            this.filters.push({
              text: 'Med resursen ' + rr.resourceType.asText(),
              resourceType: rr.resourceType
            });
          }
        }
      });
    });
  }

  private setupShowFromList(): void {
    const now = moment().add(1, 'month');
    const partOfYear: number = Math.floor(now.clone().month() / 6);
    let from: moment.Moment = now.clone().startOf('month').set('month', 6 * partOfYear);
    this.allShowFrom.push(this.halfYearShowFrom(from.clone().add(12, 'months')));
    this.allShowFrom.push(this.halfYearShowFrom(from.clone().add(6, 'months')));
    this.allShowFrom.push(this.halfYearShowFrom(from.clone()));
    if (partOfYear === 1) {
      this.allShowFrom.push(this.halfYearShowFrom(from.clone().subtract(6, 'months')));
    }
    this.allShowFrom.push(this.yearShowFrom(from.clone().subtract(1, 'years')));
    this.allShowFrom.push(this.yearShowFrom(from.clone().subtract(2, 'years')));
    this.allShowFrom.push(this.yearShowFrom(from.clone().subtract(3, 'years')));
  }

  private halfYearShowFrom(from: moment.Moment): ShowFrom {
    let before: moment.Moment = from.clone().add(6, 'months')
    let text: string = from.format('YYYY') + (from.month() < 6 ? ' VT' : ' HT');
    return { text, from, before };
  }

  private yearShowFrom(from: moment.Moment): ShowFrom {
    from.month(0);
    let before: moment.Moment = from.clone().add(1, 'year')
    let text: string = from.format('YYYY');
    return { text, from, before };
  }

}
