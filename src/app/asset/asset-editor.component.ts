import { Component, Input, OnInit } from '@angular/core';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { AssetsResource, AssetUpdate } from '../shared/server/assets.resource';

import { Asset, AssetFolder, TimeRange } from '../shared/server/rest-api.model';

import * as moment from 'moment';

@Component({
  selector: 'lc-asset-editor',
  templateUrl: './asset-editor.component.html',
  styleUrls: ['./asset-editor.component.scss']
})
export class AssetEditorComponent extends BaseEditor<Asset, AssetUpdate> {

  assetFolder: AssetFolder;

  @Input('assetFolder')
  set setAssetFolder(assetFolder: AssetFolder) {
    this.assetFolder = assetFolder;
  }

  constructor(
    private authPermission: AuthPermissionService,
    private assetsResource: AssetsResource,
  ) {
    super(assetsResource);
  }

  protected allEditorStates(): Array<EditorState> {
    return [];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.assetsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.assetsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }
}
