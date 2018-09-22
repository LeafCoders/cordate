import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EditorState } from '../../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../../auth/auth-permission.service';
import { TextValuesResource } from '../../shared/server/text-values.resource';
import { TextValue } from '../../shared/server/rest-api.model';

@Component({
  selector: 'lc-text-value-editor',
  templateUrl: './text-value-editor.component.html',
  styleUrls: ['./text-value-editor.component.scss']
})
export class TextValueEditorComponent {

  textValue: TextValue;
  createMode: boolean = false;
  creatingNew: boolean;

  idState: EditorState = new EditorState();
  formatState: EditorState = new EditorState();
  isPublicState: EditorState = new EditorState();
  valueState: EditorState = new EditorState();

  private editorStates: Array<EditorState> = [
    this.idState, this.formatState, this.isPublicState, this.valueState
  ];

  constructor(
    private textValuesResource: TextValuesResource,
    private authPermission: AuthPermissionService
  ) { }

  @Output('close') closeEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output('updated') updatedEmitter: EventEmitter<TextValue> = new EventEmitter<TextValue>();

  @Input('textValue')
  set setTextValue(textValue: TextValue) {
    EditorState.resetAll(this.editorStates);
    if (textValue) {
      this.createMode = !textValue.id;
      EditorState.setAllCreateMode(this.editorStates, this.createMode);
      if (this.createMode || this.authPermission.isPermitted(`textValues:update:${textValue.id}`)) {
        EditorState.setAllEditable(this.editorStates);
        this.idState.editable = false;
      }
    }
    this.textValue = textValue;
  }

  closeEditor(clearContent: boolean = false): void {
    if (clearContent) {
      this.textValue = undefined;
    }
    this.closeEmitter.emit();
  }

  createTextValue(): void {
    this.creatingNew = true;
    this.textValuesResource.create(this.textValue).subscribe((TextValue: TextValue) => {
      this.updatedEmitter.emit(TextValue);
      this.setTextValue = TextValue;
      setTimeout(() => {
        this.creatingNew = false;
        this.closeEmitter.emit();
      }, 300);
    }, () => {
      this.creatingNew = false;
    });
  }

  setId(id: number): void {
    let textValueUpdate: TextValue = this.textValue.updateObject();
    textValueUpdate.id = id;
    this.updateTextValue(textValueUpdate, this.idState);
  }

  setFormat(format: string): void {
    let textValueUpdate: TextValue = this.textValue.updateObject();
    textValueUpdate.format = format;
    this.updateTextValue(textValueUpdate, this.formatState);
  }

  setIsPublic(isPublic: boolean): void {
    let textValueUpdate: TextValue = this.textValue.updateObject();
    textValueUpdate.isPublic = isPublic;
    this.updateTextValue(textValueUpdate, this.isPublicState);
  }

  setValue(value: string): void {
    let textValueUpdate: TextValue = this.textValue.updateObject();
    textValueUpdate.value = value;
    this.updateTextValue(textValueUpdate, this.valueState);
  }

  private updateTextValue(textValueUpdate: TextValue, state: EditorState): void {
    if (!this.createMode) {
      state.saving = true;
      this.textValuesResource.update(this.textValue.id, textValueUpdate).subscribe((textValue: TextValue) => {
        this.textValue.mergeWith(textValueUpdate);
        this.updatedEmitter.emit(this.textValue);
        setTimeout(() => state.saving = false, 300);
      }, () => {
        state.saving = false;
      });
    } else {
      this.textValue.mergeWith(textValueUpdate);
    }
  }
}
