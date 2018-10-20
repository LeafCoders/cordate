import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { GroupsResource, GroupUpdate } from '../shared/server/groups.resource';
import { UsersResource } from '../shared/server/users.resource';

import { Group, User, UserList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-group-editor',
  templateUrl: './group-editor.component.html'
})
export class GroupEditorComponent extends BaseEditor<Group, GroupUpdate> {

  idAliasState: EditorState = new EditorState();
  nameState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();

  allUsers: UserList = [];
  usersNotInGroup: UserList = [];

  constructor(
    private authPermission: AuthPermissionService,
    private groupsResource: GroupsResource,
    private usersResource: UsersResource,
    dialog: MatDialog,
  ) {
    super(groupsResource, dialog);

    this.usersResource.list().subscribe(users => {
      this.allUsers = users;
      this.refreshUsersNotInGroup();
    });
  }

  protected afterSetEditorItem(item: Group): void {
    this.refreshUsersNotInGroup();
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.nameState, this.descriptionState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.groupsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.groupsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: GroupUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setName(name: string): void {
    this.setValue(this.nameState,
      (item: GroupUpdate) => item.name = name,
      () => this.item.name = name
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: GroupUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  addUser(user: User): void {
    this.groupsResource.addUser(this.item, user.id).subscribe(() => this.refreshUsersNotInGroup());
  }

  removeUser(user: User): void {
    this.groupsResource.removeUser(this.item, user.id).subscribe(() => this.refreshUsersNotInGroup());
  }

  private refreshUsersNotInGroup(): void {
    this.usersNotInGroup = this.item ? User.restOf<User>(this.allUsers, this.item.users) : [];
  }
}
