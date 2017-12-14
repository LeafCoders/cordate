import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';

import { EditorState } from '../editor-state';

@Component({
  selector: 'lc-password-editor',
  templateUrl: './password-editor.component.html',
  styleUrls: ['./password-editor.component.scss']
})
export class PasswordEditorComponent {

  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatInput) private inputElement: MatInput;

  displayValue: string;
  editingValue: string;

  @Input('value')
  set setInValue(inValue: string) {
    this.displayValue = '********';
    this.editingValue = '';
  }

  valueChanged(): void {
    if (this.state.createMode) {
      this.changedEmitter.emit(this.editingValue);
    }
  }

  buttonClicked(): void {
    if (this.state.editing) {
      this.saveValue();
    } else {
      this.state.editing = true;
      setTimeout(() => this.inputElement.focus(), 1);
    }
  }

  private saveValue(): void {
    if (this.editingValue.length) {
      this.changedEmitter.emit(this.editingValue);
    }
    this.cancel();
  }

  private cancel(): void {
    this.state.editing = false;
    this.editingValue = '';
  }
}
