import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

import { TimeRange } from '../server/rest-api.model';

interface DayCalData {
  date: moment.Moment;
  day: number;
  inMonth: boolean;
  selected: boolean;
}

type DaysRow = Array<DayCalData>;

interface TimeCalData {
  value: number;
  isHour?: boolean;
  selected: boolean;
}

interface CalData {
  month: moment.Moment;
  dateRows: Array<DaysRow>;
  timeRows: Array<Array<TimeCalData>>;
}

interface DateTexts {
  date: string;
  time: string;
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
}

@Component({
  selector: 'lc-time-range-select',
  templateUrl: './time-range-select.component.html',
  styleUrls: ['./time-range-select.component.scss']
})
export class TimeRangeSelectComponent implements OnInit, OnChanges {

  @Input('selectedStart') inStart: moment.Moment;
  @Input('selectedEnd') inEnd: moment.Moment;
  @Output() saveTimeRange: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();

  showModal: boolean = false;
  selectedStart: moment.Moment;
  selectedEnd: moment.Moment;

  dateTexts: DateTexts;

  calStart: CalData = { month: undefined, dateRows: [], timeRows: [] };
  calEnd: CalData = { month: undefined, dateRows: [], timeRows: [] };

  constructor() { }

  ngOnInit() {
    this.initDates();
  }

  ngOnChanges(data: any) {
    this.initDates();
  }

  representation(): string {
    return (this.inStart ? this.inStart.format('L') : '?') + ' - ' + (this.inEnd ? this.inEnd.format('L') : '');
  }

  ok(): void {
    this.showModal = false;
    this.saveTimeRange.emit(<TimeRange>{
      start: this.selectedStart,
      end: this.selectedEnd
    });
  }

  cancel(): void {
    this.showModal = false;
  }

  moveStart(months: number): void {
    this.calStart.month.add(months, 'months');
    this.updateData();
  }

  moveEnd(months: number): void {
    this.calEnd.month.add(months, 'months');
    this.updateData();
  }

  selectStartDate(date: moment.Moment): void {
    this.setStart(
      this.selectedStart.clone().set({ year: date.year(), month: date.month(), date: date.date() })
    );
  }

  selectStartTime(time: TimeCalData): void {
    let newTime: moment.Moment = this.selectedStart.clone();
    this.setStart(time.isHour ? newTime.hour(time.value) : newTime.minute(time.value));
  }

  selectEndDate(date: moment.Moment): void {
    this.setEnd(
      this.selectedEnd.clone().set({ year: date.year(), month: date.month(), date: date.date() })
    );
  }

  selectEndTime(time: TimeCalData): void {
    let newTime: moment.Moment = this.selectedEnd.clone();
    this.setEnd(time.isHour ? newTime.hour(time.value) : newTime.minute(time.value));
  }

  private setStart(time: moment.Moment): void {
    if (time.isAfter(this.selectedEnd)) {
      this.selectedEnd = time.clone().add(1, 'hour');
    }
    this.selectedStart = time;
    this.updateData();
  }

  private setEnd(time: moment.Moment): void {
    if (this.selectedStart.isBefore(time)) {
      this.selectedEnd = time;
      this.updateData();
    }
  }

  private initDates(): void {
    this.calStart.month = undefined;
    this.calEnd.month = undefined;
    this.selectedStart = this.inStart ? this.inStart.clone() : moment().startOf('hour');
    this.selectedEnd = this.inEnd ? this.inEnd.clone() : undefined;
    this.updateData();
  }

  private updateData(): void {
    this.updateDateTexts();
    this.updateTable(this.selectedStart, this.calStart);
    this.updateTable(this.selectedEnd, this.calEnd);
  }

  private updateDateTexts(): void {
    let date: string = this.selectedStart ? this.selectedStart.format('ddd ll') : 'Ej satt';
    let time: string = this.selectedStart ? this.selectedStart.format('LT') : '';
    if (this.selectedEnd) {
      if (this.selectedEnd.isAfter(this.selectedStart, 'day')) {
        date += ' - ' + this.selectedEnd.format('ddd ll');
      }
      time += ' - ' + this.selectedEnd.format('LT');
    }
    this.dateTexts = {
      date: date,
      time: time,
      startDay: (this.selectedStart ? this.selectedStart.format('ddd ll') : '-'),
      startTime: (this.selectedStart ? this.selectedStart.format('LT') : '-'),
      endDay: (this.selectedEnd ? this.selectedEnd.format('ddd ll') : '-'),
      endTime: (this.selectedEnd ? this.selectedEnd.format('LT') : '-')
    }
  }

  private updateTable(time: moment.Moment, cal: CalData): void {
    let from: moment.Moment = cal.month ? cal.month : (time ? time.clone() : moment());
    let maxDate: moment.Moment = from.clone().endOf('month');
    cal.month = maxDate.clone();
    from.startOf('month').startOf('week');

    cal.dateRows = [];
    while (from.isBefore(maxDate)) {
      let row: DaysRow = [];
      for (let i = 0; i < 7; ++i) {
        row.push(<DayCalData>{
          date: from.clone(),
          day: from.date(),
          inMonth: maxDate.month() === from.month(),
          selected: time ? from.isSame(time, 'day') : false
        });
        from.add(1, 'day');
      }
      cal.dateRows.push(row);
    }

    let selectedHour: number = time ? time.hour() : 12;
    let selected5Minute: number = time ? Math.floor(time.minute() / 5) : 0;
    cal.timeRows = [[], [], [], [], [], [], []];
    for (let i = 0; i < 24; ++i) {
      //      this.calTimeRows[i % 6].push(<TimeCalData>{ value: i, selected: selectedHour === i, isHour: true });
      cal.timeRows[Math.floor(i / 4)].push(<TimeCalData>{ value: i, selected: selectedHour === i, isHour: true });
    }
    for (let i = 0; i < 6; ++i) {
      //      this.calTimeRows[i].push(<TimeCalData>{});
      cal.timeRows[i].push(<TimeCalData>{});
    }
    for (let i = 0; i < 12; ++i) {
      //      this.calTimeRows[i % 6].push(<TimeCalData>{ value: 5 * i, selected: selected5Minute === i });
      cal.timeRows[Math.floor(i / 2)].push(<TimeCalData>{ value: 5 * i, selected: selected5Minute === i });
    }
  }
}
