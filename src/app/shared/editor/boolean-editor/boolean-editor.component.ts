import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EditorState } from '../editor-state';

@Component({
  selector: 'lc-boolean-editor',
  templateUrl: './boolean-editor.component.html'
})
export class BooleanEditorComponent {

  @Input() valueTitle: string;
  @Input() value: boolean;
  @Input() trueIcon: string;
  @Input() falseIcon: string;
  @Input() trueText: string;
  @Input() falseText: string;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  valueSelected(newValue: boolean): void {
    this.value = newValue;
    this.changed.emit(newValue);
  }

  icon(): string {
    return this.value ? (this.trueIcon ? this.trueIcon : this.falseIcon) : (this.falseIcon ? this.falseIcon : this.trueIcon);
  }

  text(): string {
    return this.value ? this.trueText : this.falseText;
  }
}
