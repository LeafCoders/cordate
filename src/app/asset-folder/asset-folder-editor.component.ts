import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetFoldersResource, AssetFolderUpdate } from '../shared/server/asset-folders.resource';

import { AssetFolder } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-asset-folder-editor',
  templateUrl: './asset-folder-editor.component.html'
})
export class AssetFolderEditorComponent extends BaseEditor<AssetFolder, AssetFolderUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  allowedMimeTypesState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private assetFoldersResource: AssetFoldersResource,
    dialog: MatDialog,
  ) {
    super(assetFoldersResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.descriptionState, this.allowedMimeTypesState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.assetFoldersResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.assetFoldersResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: AssetFolderUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: AssetFolderUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: AssetFolderUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setAllowedMimeTypes(allowedMimeTypes: string): void {
    this.setValue(this.allowedMimeTypesState,
      (item: AssetFolderUpdate) => item.allowedMimeTypes = allowedMimeTypes,
      () => this.item.allowedMimeTypes = allowedMimeTypes
    );
  }
}
