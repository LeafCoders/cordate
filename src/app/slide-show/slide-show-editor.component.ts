import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlideShowsResource, SlideShowUpdate } from '../shared/server/slide-shows.resource';

import { AssetFolder, SlideShow } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-slide-show-editor',
  templateUrl: './slide-show-editor.component.html'
})
export class SlideShowEditorComponent extends BaseEditor<SlideShow, SlideShowUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  assetFolderState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private slideShowsResource: SlideShowsResource,
    dialog: MatDialog,
  ) {
    super(slideShowsResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.assetFolderState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.slideShowsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.slideShowsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: SlideShowUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: SlideShowUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setAssetFolder(assetFolder: AssetFolder): void {
    this.setValue(this.assetFolderState,
      (item: SlideShowUpdate) => item.assetFolderId = assetFolder.id,
      () => this.item.assetFolder = assetFolder
    );
  }
}
