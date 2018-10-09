import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { DefaultBaseResource } from '../server/default-base.resource';
import { EditorAction } from '../../shared/editor/editor-action';
import { EditorState } from '../../shared/editor/editor-state';
import { IdModel } from '../server/rest-api.model';

export abstract class BaseEditor<ITEM extends IdModel, UPDATE> implements OnInit {

  item: ITEM;
  creatingNew: boolean = false;
  actions: Array<EditorAction> = [];

  protected createValues: UPDATE;

  @Output('close') closeEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private resource: DefaultBaseResource<ITEM, UPDATE>
  ) {
  }

  protected abstract allEditorStates(): Array<EditorState>;
  protected abstract checkPermissions(): void;
  protected abstract rebuildActions(): Array<EditorAction>;

  protected init(): void { };
  protected afterSetEditorItem(item: ITEM): void { };
  protected afterCreatedItem(): void { };

  ngOnInit() {
    this.init();
  }

  @Input('item')
  set setEditorItem(item: ITEM) {
    this.item = item;
    this.actions = [];

    const editorStates: Array<EditorState> = this.allEditorStates();
    EditorState.resetAll(editorStates);

    if (item) {
      this.afterSetEditorItem(item);
      this.createValues = this.isNew() ? this.resource.updateInstance(item) : undefined;
      EditorState.setAllCreateMode(editorStates, this.isNew());
      if (this.isExisting()) {
        this.checkPermissions();
        this.actions = this.rebuildActions();
      }
    }
  }

  closeEditor(clearContent: boolean = false): void {
    if (clearContent) {
      this.item = undefined;
    }
    this.closeEmitter.emit();
  }

  createItem(): void {
    this.creatingNew = true;
    this.resource.create(this.createValues).subscribe((item: ITEM) => {
      this.setEditorItem = item;
      setTimeout(() => {
        this.creatingNew = false;
        this.closeEmitter.emit();
        this.afterCreatedItem();
      }, 300);
    }, () => {
      this.creatingNew = false;
    });
  }

  deleteItem(): void {
    this.resource.delete(this.item.id, this.item).subscribe(() => {
      this.setEditorItem = undefined;
      this.closeEmitter.emit();
    });
  }

  protected isNew(): boolean {
    return this.item && !this.item.id;
  }

  protected isExisting(): boolean {
    return this.item && !!this.item.id;
  }

  protected setValue(state: EditorState, updateFn: (item: UPDATE) => void, afterSuccessFn: () => void): void {
    let itemUpdate: UPDATE = this.isNew() ? this.createValues : this.resource.updateInstance(this.item);
    updateFn(itemUpdate);
    this.updateItem(itemUpdate, state, afterSuccessFn);
  }

  private updateItem(updateValues: UPDATE, state: EditorState, afterSuccessFn: () => void): void {
    if (!this.isNew()) {
      state.saving = true;
      this.resource.update(this.item.id, updateValues).subscribe((updatedItem: ITEM) => {
        afterSuccessFn();
        setTimeout(() => state.saving = false, 300);
      }, () => {
        state.saving = false;
      });
    }
  }

}
