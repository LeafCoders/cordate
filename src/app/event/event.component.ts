import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import * as moment from 'moment';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventsResource } from '../shared/server/events.resource';
import { EventTypesResource } from '../shared/server/event-types.resource';
import { Event, EventList, ResourceRequirement, ResourceTypeRef, EventTypeList, EventType } from '../shared/server/rest-api.model';
import { EventNewDialogComponent } from './new-dialog/event-new-dialog.component';
import { FilterItem, NONE_FILTER, LAST_WEEK, ShowFrom } from './event-common';
import { WebSocketMessagingService } from '../shared/server/web-socket-messaging.service';

@Component({
  selector: 'lc-event',
  templateUrl: './event.component.html'
})
export class EventComponent extends BaseContainer<Event> implements OnDestroy {

  // Filters
  weekView: boolean = true;
  filters: Array<FilterItem> = [NONE_FILTER];
  selectedFilter: FilterItem = NONE_FILTER;
  allShowFrom: Array<ShowFrom> = [LAST_WEEK];
  selectedShowFrom: ShowFrom = LAST_WEEK;

  private newEventDialogRef: MatDialogRef<EventNewDialogComponent>;
  private messagingService: WebSocketMessagingService;

  constructor(
    private eventsResource: EventsResource,
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(eventsResource, router, route);
    this.selectShowFrom(this.selectedShowFrom);
    this.initializeWebSocketConnection();
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
    if (this.messagingService) {
      this.messagingService.disconnect();
    }
  }

  private initializeWebSocketConnection() {
    this.messagingService = new WebSocketMessagingService('/events');
    this.messagingService.stream().subscribe(message => {
      this.eventsResource.replaceUpdated(new Event(JSON.parse(message.body)));
    });
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

  showNewDialog(fromDate: moment.Moment = moment()): void {
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
