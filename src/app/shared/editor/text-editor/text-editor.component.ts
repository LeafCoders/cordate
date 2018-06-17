import { Component, EventEmitter, Input, Output, ContentChildren, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { MatInput } from '@angular/material';

import { EditorState } from '../editor-state';

@Component({
  selector: 'lc-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() editingHelpText: string;
  @Input() multiLine: boolean = false;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren(MatInput) private inputElements: QueryList<MatInput>;

  value: string;
  displayValue: string;
  editingValue: string;

  private initialValue: string;

  @Input('value')
  set setInValue(inValue: string) {
    this.initialValue = this.initialValue ? this.initialValue : inValue;
    this.value = inValue;
    if (inValue) {
      this.displayValue = inValue.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/\n/g, '<br>');
    } else {
      this.displayValue = '-';
    }
    this.editingValue = inValue;
  }

  editorIcon(): string {
    return this.icon ? this.icon : (this.multiLine ? 'subject' : 'short_text');
  }

  valueChanged(): void {
    if (this.state.createMode) {
      this.changedEmitter.emit(this.editingValue);
    }
  }

  editOrSave(): void {
    if (this.state.editing) {
      this.saveValue();
    } else {
      this.state.editing = true;
      setTimeout(() => this.inputElements.forEach(input => input.focus()), 1);
    }
  }

  cancel(): void {
    this.state.editing = false;
    this.editingValue = this.value;
  }

  private saveValue(): void {
    if (this.initialValue != this.editingValue) {
      this.changedEmitter.emit(this.editingValue);
    }
    this.cancel();
  }

}
