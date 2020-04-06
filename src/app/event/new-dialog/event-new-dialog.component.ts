import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

import { EventTypesResource } from '../../shared/server/event-types.resource';
import { EventsResource } from '../../shared/server/events.resource';
import { AuthPermissionService } from '../../auth/auth-permission.service';
import { EventType, EventTypeList } from '../../shared/server/rest-api.model';

@Component({
  selector: 'lc-event-new-dialog',
  templateUrl: './event-new-dialog.component.html',
  styleUrls: ['./event-new-dialog.component.scss']
})
export class EventNewDialogComponent implements OnInit {

  startDate: moment.Moment;

  eventTypes: EventTypeList;
  selectedEventType: EventType;
  dates: Array<moment.Moment> = [];
  datesHeader: string;

  constructor(
    public dialogRef: MatDialogRef<EventNewDialogComponent>,
    private eventsResource: EventsResource,
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
  ) {
  }

  ngOnInit() {
    this.eventTypesResource.listOnce().subscribe((eventTypes: EventTypeList) => {
      this.eventTypes = eventTypes.filter((eventType: EventType) => {
        return this.authPermission.isPermitted(this.eventsResource.createPermission(eventType));
      });
    });
    this.updateDateList();
  }

  selectDate(date: moment.Moment): void {
    this.dialogRef.close({ eventType: this.selectedEventType, startDate: date });
  }

  moveDates(direction: number): void {
    this.startDate.add(direction, 'week');
    this.updateDateList();
  }

  private updateDateList(): void {
    if (this.startDate) {
      this.dates = [];
      let numDays: number;
      this.datesHeader = 'Vecka ' + this.startDate.format('W, YYYY');
      numDays = 7;
      for (let i = 0; i < numDays; ++i) {
        this.dates.push(this.startDate.clone().add(i, 'days'));
      }
    }
  }

}
