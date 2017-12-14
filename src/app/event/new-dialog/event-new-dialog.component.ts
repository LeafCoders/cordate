import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as moment from 'moment';

import { EventTypesResource } from '../../shared/server/event-types.resource';
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
    private dialogRef: MatDialogRef<EventNewDialogComponent>,
    private eventTypesResource: EventTypesResource
  ) {
  }

  ngOnInit() {
    this.eventTypesResource.list().subscribe((eventTypes: EventTypeList) => this.eventTypes = eventTypes);
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
