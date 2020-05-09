import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionSetsResource, PermissionSetUpdate } from '../shared/server/permission-sets.resource';
import { PermissionSet } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-permission-set-editor',
  templateUrl: './permission-set-editor.component.html'
})
export class PermissionSetEditorComponent extends BaseEditor<PermissionSet, PermissionSetUpdate> {

  nameState: EditorState = new EditorState();
  patternsState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private permissionSetsResource: PermissionSetsResource,
    dialog: MatDialog,
  ) {
    super(permissionSetsResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.nameState, this.patternsState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.permissionSetsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.permissionSetsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: PermissionSetUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setPatterns(patterns: string): void {
    this.setValue(this.patternsState,
      (item: PermissionSetUpdate) => item.patterns = patterns,
      () => this.item.patterns = patterns
    );
  }

}
