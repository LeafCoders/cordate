import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditorAction } from '../../../shared/editor/editor-action';
import { EditorState } from '../../../shared/editor/editor-state';
import { IdModel } from '../../server/rest-api.model';

@Component({
  selector: 'lc-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.scss']
})
export class EditorContainerComponent {

  @Input('item') item: IdModel;
  @Input('actions') actions: Array<EditorAction>;
  @Input('disabled') disabled: boolean;

  @Output('closeEditor') closeEditorEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('createItem') createItemEmitter: EventEmitter<void> = new EventEmitter<void>();

  closeEditor(closeAside: boolean = false): void {
    this.closeEditorEmitter.emit(closeAside);
  }

  createItem(): void {
    this.createItemEmitter.emit();
  }

}
