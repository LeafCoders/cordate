import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourceTypesResource, ResourceTypeUpdate } from '../shared/server/resource-types.resource';

import { ResourceType, UserList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-type-editor',
  templateUrl: './resource-type-editor.component.html'
})
export class ResourceTypeEditorComponent extends BaseEditor<ResourceType, ResourceTypeUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();

  allUsers: UserList = [];
  usersNotInResourceType: UserList = [];

  constructor(
    private authPermission: AuthPermissionService,
    private resourceTypesResource: ResourceTypesResource,
    dialog: MatDialog,
  ) {
    super(resourceTypesResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.descriptionState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.resourceTypesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.resourceTypesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: ResourceTypeUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: ResourceTypeUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: ResourceTypeUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

}
