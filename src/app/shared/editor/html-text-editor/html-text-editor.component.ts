import { Component, EventEmitter, Input, Output, ContentChildren, QueryList, ViewChildren, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { EditorState } from '../editor-state';
import { HtmlText } from '../../server/rest-api.model';

type QuillSource = 'api' | 'silent' | 'user';

interface QuillEditor {
  getText(): string;
  getContents(): JSON;

  setText(text: string): string;
  setText(text: string, source: QuillSource): string;
  setContents(delta: JSON): void;
  setContents(delta: JSON, source: QuillSource): void;

  pasteHTML(html: string): void;
  pasteHTML(html: string, source: QuillSource): void;
  pasteHTML(index: number, html: string): void;
  pasteHTML(index: number, html: string, source: QuillSource): void;
}

@Component({
  selector: 'lc-html-text-editor',
  templateUrl: './html-text-editor.component.html',
  styleUrls: ['./html-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HtmlTextEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() editingHelpText: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<HtmlText> = new EventEmitter<HtmlText>();

  @ViewChildren(MatInput) private inputElements: QueryList<MatInput>;

  value: HtmlText;
  displayValue: string;
  editingValue: HtmlText;

  private quillEditor: QuillEditor;
  quillDelta: object;

  private initialValue: HtmlText;

  quillFormats = ['bold', 'italic', 'underline', 'link', 'header', 'blockquote', 'list'];

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link'],
      [{ 'header': 1 }, { 'header': 2 }, 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ],
    clipboard: {
      matchVisual: false
    }
  };

  @Input('value')
  set setInValue(inValue: HtmlText) {
    this.initialValue = this.initialValue ? this.initialValue : inValue;
    this.value = inValue;
    this.editingValue = inValue;
    if (inValue) {
      this.displayValue = inValue.contentHtml;
    } else {
      this.displayValue = '-';
    }
  }

  editorIcon(): string {
    return this.icon ? this.icon : 'subject';
  }

  quillCreated(editor: QuillEditor) {
    this.quillEditor = editor;
    if (this.editingValue) {
      try {
        if (this.editingValue.contentRaw) {
          const jsonContent: JSON = JSON.parse(this.editingValue.contentRaw);
          editor.setContents(jsonContent, 'silent');
          return;
        }
      } catch (e) { }
      if (this.editingValue.contentHtml) {
        editor.pasteHTML(this.editingValue.contentHtml, 'silent');
      }
    }
  }

  valueChanged(): void {
    if (this.state.createMode) {
      this.changedEmitter.emit(this.editingValue);
    }
  }

  quillContentChanged(data: { editor: QuillEditor, html: string, text: string, delta: JSON, source: string }) {
    this.editingValue = { contentRaw: JSON.stringify(this.quillEditor.getContents()), contentHtml: data.html };
    this.valueChanged();
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
