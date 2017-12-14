import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import * as moment from 'moment';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventsResource } from '../shared/server/events.resource';
import { Event, EventList, ResourceRequirement, ResourceTypeRef } from '../shared/server/rest-api.model';
import { EventNewDialogComponent } from './new-dialog/event-new-dialog.component';
import { FilterItem, NONE_FILTER, LAST_WEEK, ShowFrom } from './event-common';

@Component({
  selector: 'lc-event',
  templateUrl: './event.component.html'
})
export class EventComponent extends BaseContainer<Event> {

  // Filters
  weekView: boolean = true;
  filters: Array<FilterItem> = [NONE_FILTER];
  selectedFilter: FilterItem = NONE_FILTER;
  allShowFrom: Array<ShowFrom> = [LAST_WEEK];
  selectedShowFrom: ShowFrom = LAST_WEEK;

  private newEventDialogRef: MatDialogRef<EventNewDialogComponent>;

  constructor(
    private eventsResource: EventsResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
  ) {
    super(eventsResource);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.eventsResource.createPermission());

    this.setupShowFromList();
    this.eventsResource.list().subscribe((events: EventList) => {
      this.buildFilterItems(events);
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
    this.eventsResource.setListParams({ from: showFromToSelect.from, before: showFromToSelect.before });
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

    this.filters.push({ text: 'Med mig', disabled: true });
    this.filters.push({ text: 'Avancerat...', disabled: true });
  }

  private setupShowFromList(): void {
    let from: moment.Moment = moment().startOf('month').set('month', 6 * (moment().month() % 6));
    for (let i = 0; i < 6; ++i) {
      let before: moment.Moment = from.clone();
      from = from.clone().subtract(6, 'months');
      let text: string = from.format('YYYY') + (from.month() < 6 ? ' VT' : ' HT');
      this.allShowFrom.push({ text, from, before });
    }
  }

}
