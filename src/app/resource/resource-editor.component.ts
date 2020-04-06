import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ResourcesResource, ResourceUpdate } from '../shared/server/resources.resource';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';

import { Resource, ResourceTypeRef, User } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-resource-editor',
  templateUrl: './resource-editor.component.html'
})
export class ResourceEditorComponent extends BaseEditor<Resource, ResourceUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  userState: EditorState = new EditorState();

  allResourceTypes: Array<ResourceTypeRef> = [];
  resourceTypesNotInResource: Array<ResourceTypeRef> = [];

  constructor(
    private authPermission: AuthPermissionService,
    private resourcesResource: ResourcesResource,
    private resourceTypesResource: ResourceTypesResource,
    dialog: MatDialog,
  ) {
    super(resourcesResource, dialog);

    this.resourceTypesResource.list().subscribe(resourceTypes => {
      this.allResourceTypes = resourceTypes.map(r => r.asRef());
      this.refreshResourceTypeNotInResource();
    });
  }

  protected afterSetEditorItem(item: Resource): void {
    this.refreshResourceTypeNotInResource();
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.descriptionState, this.userState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.resourcesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.resourcesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: ResourceUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: ResourceUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setUser(user: User): void {
    this.setValue(this.userState,
      (item: ResourceUpdate) => item.userId = user.id,
      () => this.item.user = user.asRef()
    );
  }

  addResourceType(resourceType: ResourceTypeRef): void {
    this.resourcesResource.addResourceType(this.item, resourceType.id).subscribe(() => this.refreshResourceTypeNotInResource());
  }

  removeResourceType(resourceType: ResourceTypeRef): void {
    this.resourcesResource.removeResourceType(this.item, resourceType.id).subscribe(() => this.refreshResourceTypeNotInResource());
  }

  private refreshResourceTypeNotInResource(): void {
    this.resourceTypesNotInResource = this.item ? ResourceTypeRef.restOf<ResourceTypeRef>(this.allResourceTypes, this.item.resourceTypes) : [];
  }
}
