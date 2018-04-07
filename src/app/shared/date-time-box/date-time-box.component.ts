import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'lc-date-time-box',
  templateUrl: './date-time-box.component.html',
  styleUrls: ['./date-time-box.component.scss']
})
export class DateTimeBoxComponent {

  dayNumber: number;
  dayName: string;
  monthName: string;
  time: string;

  @Input()
  set date(dateTime: moment.Moment) {
    this.dayNumber = dateTime ? dateTime.date() : undefined;
    this.dayName = dateTime ? dateTime.format('ddd') : undefined;
    this.monthName = dateTime ? dateTime.format('MMM') : undefined;
    this.time = dateTime ? dateTime.format('HH:mm') : undefined;
  }
}
