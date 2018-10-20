import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionsResource, PermissionUpdate } from '../shared/server/permissions.resource';
import { GroupsResource } from '../shared/server/groups.resource';
import { UsersResource } from '../shared/server/users.resource';
import { Permission, IdModel, Group, User, PermissionLevel } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-permission-editor',
  templateUrl: './permission-editor.component.html'
})
export class PermissionEditorComponent extends BaseEditor<Permission, PermissionUpdate> {

  nameState: EditorState = new EditorState();
  entityState: EditorState = new EditorState();
  patternsState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private permissionsResource: PermissionsResource,
    private groupsResource: GroupsResource,
    private usersResource: UsersResource,
    dialog: MatDialog,
  ) {
    super(permissionsResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.nameState, this.entityState, this.patternsState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.permissionsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.permissionsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  protected afterSetEditorItem(item: Permission): void {
    if (item.entity) {
      if (item.isLevel(PermissionLevel.ONE_GROUP)) {
        this.groupsResource.get(item.entity.id).subscribe(group => {
          (<Group>item.entity).name = group.name;
        });
      } else if (item.isLevel(PermissionLevel.ONE_USER)) {
        this.usersResource.get(item.entity.id).subscribe(user => {
          (<User>item.entity).firstName = user.firstName;
          (<User>item.entity).lastName = user.lastName;
        });
      }
    }
  }


  levelText(): string {
    switch (this.item.level) {
      case PermissionLevel.PUBLIC: return 'För alla (publikt)';
      case PermissionLevel.ALL_USERS: return 'För alla användare';
      case PermissionLevel.ONE_GROUP: return 'För en grupp';
      case PermissionLevel.ONE_USER: return 'För en användare';
    }
    return 'Felaktig nivå. Ta bort denna!'
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: PermissionUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setEntity(entity: IdModel): void {
    this.setValue(this.entityState,
      (item: PermissionUpdate) => item.entityId = entity.id,
      () => this.item.entity = entity
    );
  }

  setPatterns(patterns: string): void {
    this.setValue(this.patternsState,
      (item: PermissionUpdate) => item.patterns = patterns,
      () => this.item.patterns = patterns
    );
  }

}
