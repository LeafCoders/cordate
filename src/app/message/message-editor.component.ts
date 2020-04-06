import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { MessagesResource, MessageUpdate } from '../shared/server/messages.resource';

import { Message } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-message-editor',
  templateUrl: './message-editor.component.html'
})
export class MessageEditorComponent extends BaseEditor<Message, MessageUpdate> {

  messageState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private messagesResource: MessagesResource,
    dialog: MatDialog,
  ) {
    super(messagesResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.messageState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.messagesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    return [];
  }

  setMessage(message: string): void {
    this.setValue(this.messageState,
      (item: MessageUpdate) => item.message = message,
      () => this.item.message = message
    );
  }
}
