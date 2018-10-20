import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventTypesResource, EventTypeUpdate } from '../shared/server/event-types.resource';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';

import { EventType, ResourceTypeRef } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-event-type-editor',
  templateUrl: './event-type-editor.component.html'
})
export class EventTypeEditorComponent extends BaseEditor<EventType, EventTypeUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  isPublicState: EditorState = new EditorState();

  allResourceTypes: Array<ResourceTypeRef> = [];
  resourceTypesNotInEventType: Array<ResourceTypeRef> = [];

  constructor(
    private authPermission: AuthPermissionService,
    private eventTypesResource: EventTypesResource,
    private resourceTypesResource: ResourceTypesResource,
    dialog: MatDialog,
  ) {
    super(eventTypesResource, dialog);

    this.resourceTypesResource.list().subscribe(resourceTypes => {
      this.allResourceTypes = resourceTypes.map(r => r.asRef());
      this.refreshResourceTypesNotInEventType();
    });
  }

  protected afterSetEditorItem(item: EventType): void {
    this.refreshResourceTypesNotInEventType();
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.descriptionState, this.isPublicState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.eventTypesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.eventTypesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: EventTypeUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: EventTypeUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: EventTypeUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setIsPublic(isPublic: boolean): void {
    this.setValue(this.isPublicState,
      (item: EventTypeUpdate) => item.isPublic = isPublic,
      () => this.item.isPublic = isPublic
    );
  }

  addResourceType(resourceType: ResourceTypeRef): void {
    this.eventTypesResource.addResourceType(this.item, resourceType.id).subscribe(() => this.refreshResourceTypesNotInEventType());
  }

  removeResourceType(resourceType: ResourceTypeRef): void {
    this.eventTypesResource.removeResourceType(this.item, resourceType.id).subscribe(() => this.refreshResourceTypesNotInEventType());
  }

  private refreshResourceTypesNotInEventType(): void {
    this.resourceTypesNotInEventType = this.item ? ResourceTypeRef.restOf<ResourceTypeRef>(this.allResourceTypes, this.item.resourceTypes) : [];
  }
}
