import { Component, EventEmitter, Input, Output, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import * as moment from 'moment';

import { EditorState } from '../editor-state';

@Component({
  selector: 'lc-date-time-editor',
  templateUrl: './date-time-editor.component.html',
})
export class DateTimeEditorComponent {

  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  time: moment.Moment;
  editingDate: FormControl = new FormControl(moment());
  editingTime: string;

  @ViewChildren(MatInput) private inputElements: QueryList<MatInput>;

  @Input('time')
  set setInTime(inTime: moment.Moment) {
    this.time = inTime;
    this.editingDate.setValue(inTime);
    this.editingTime = inTime ? inTime.format('HH:mm') : '';
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

  editOrSave(): void {
    if (this.state.editing) {
      this.saveValue();
    } else {
      this.state.editing = true;
      setTimeout(() => this.inputElements.first.focus(), 1);
    }
  }

  private saveValue(): void {
    this.emitChangedValue();
    this.cancel();
  }

  cancel(): void {
    this.state.editing = false;
    this.editingDate.setValue(this.time ? this.time.clone().startOf('day') : undefined);
    this.editingTime = this.time ? this.time.format('HH:mm') : undefined;
  }

  private emitChangedValue(): void {
    let outValue: moment.Moment = this.editingDate.value;
    if (outValue && this.editingTime && this.isEmptyOrValidTime(this.editingTime)) {
      const timeParts = this.editingTime.split(':');
      outValue = outValue.clone().hour(Number(timeParts[0])).minute(Number(timeParts[1]));
    }

    this.changedEmitter.emit(outValue);
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
