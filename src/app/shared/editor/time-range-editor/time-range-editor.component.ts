import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

import { EditorState } from '../editor-state';
import { TimeRange } from '../../server/rest-api.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lc-time-range-editor',
  templateUrl: './time-range-editor.component.html',
  styleUrls: ['./time-range-editor.component.scss']
})
export class TimeRangeEditorComponent {

  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();

  startTime: moment.Moment;
  endTime: moment.Moment;
  editingStartDate: FormControl = new FormControl(moment());
  editingStartTime: string;
  editingEndDate: FormControl = new FormControl(moment());
  editingEndTime: string;


  @Input('startTime')
  set setInStartTime(inTime: moment.Moment) {
    this.startTime = inTime;
    this.editingStartDate.setValue(inTime);
    this.editingStartTime = inTime ? inTime.format('HH:mm') : '';
  }

  @Input('endTime')
  set setInEndTime(inTime: moment.Moment) {
    this.endTime = inTime;
    this.editingEndDate.setValue(inTime);
    this.editingEndTime = inTime ? inTime.format('HH:mm') : '';
  }

  dateChanged(): void {
    if (this.state.createMode) {
      this.emitChangedValue();
    }
  }

  timeChanged(): void {
    if (this.state.createMode) {
      this.emitChangedValue();
    }
  }

  saveValue(): void {
    this.emitChangedValue();
    this.cancel();
  }

  cancel(): void {
    this.state.editing = false;
    this.editingStartDate.setValue(this.startTime ? this.startTime.clone().startOf('day') : undefined);
    this.editingStartTime = this.startTime ? this.startTime.format('HH:mm') : undefined;
    this.editingEndDate.setValue(this.endTime ? this.endTime.clone().startOf('day') : undefined);
    this.editingEndTime = this.endTime ? this.endTime.format('HH:mm') : undefined;
  }

  private emitChangedValue(): void {
    let start: moment.Moment = this.editingStartDate.value;
    let end: moment.Moment = this.editingEndDate.value;
    if (start && this.editingStartTime && this.isEmptyOrValidTime(this.editingStartTime)) {
      let parts = this.editingStartTime.split(':');
      start = start.clone().hour(Number(parts[0])).minute(Number(parts[1]));
    }
    if (end && this.editingEndTime && this.isEmptyOrValidTime(this.editingEndTime)) {
      let parts = this.editingEndTime.split(':');
      end = end.clone().hour(Number(parts[0])).minute(Number(parts[1]));
    }

    this.changedEmitter.emit(<TimeRange>{ start: start, end: end });
  }

  private isEmptyOrValidTime(time: string): boolean {
    if (time && time.length > 0) {
      let parts: Array<String> = time.split(':');
      if (parts.length === 2) {
        return Number(parts[0]) >= 0 && Number(parts[0]) < 24 && Number(parts[1]) >= 0 && Number(parts[1]) < 60;
      }
    }
    return false;
  }
}
