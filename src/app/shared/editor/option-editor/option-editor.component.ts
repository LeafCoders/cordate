import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EditorState } from '../editor-state';

@Component({
  selector: 'lc-option-editor',
  templateUrl: './option-editor.component.html'
})
export class OptionEditorComponent {

  @Input() icon: string = 'local_offer';
  @Input() valueTitle: string;
  @Input() value: string;
  @Input() options: Array<{ text: string, value: string, disabled?: boolean }>;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  selectedText(): string {
    if (this.options) {
      let option: any = this.options.find(o => o.value === this.value);
      return option ? option.text : '-';
    }
    return '-';
  }

  valueSelected(newValue: string): void {
    this.value = newValue;
    this.changed.emit(newValue);
  }

}
