import { Component, OnInit } from '@angular/core';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { UsersResource, UserUpdate } from '../shared/server/users.resource';

import { User } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-user-editor',
  templateUrl: './user-editor.component.html'
})
export class UserEditorComponent extends BaseEditor<User, UserUpdate> {

  emailState: EditorState = new EditorState();
  firstNameState: EditorState = new EditorState();
  lastNameState: EditorState = new EditorState();
  passwordState: EditorState = new EditorState();
  isActiveState: EditorState = new EditorState();

  password: string = "******";

  hasAdminPermission: boolean = false;

  constructor(
    private authPermission: AuthPermissionService,
    private usersResource: UsersResource,
  ) {
    super(usersResource);
  }

  protected init(): void {
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.emailState, this.firstNameState, this.lastNameState, this.passwordState];
  }

  protected checkPermissions(): void {
    this.hasAdminPermission = this.authPermission.isPermitted(this.usersResource.adminPermission(this.item));
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.usersResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }

    EditorState.setEditable(this.isActiveState, this.hasAdminPermission);
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayCreate: boolean = this.authPermission.isPermitted(this.usersResource.createPermission());
    const mayDelete: boolean = this.authPermission.isPermitted(this.usersResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    if (mayCreate) {
      actions.push(new EditorAction('Logga in som', true, () => { }));
    }
    return actions;
  }

  setEmail(email: string): void {
    this.setValue(this.emailState,
      (item: UserUpdate) => item.email = email,
      () => this.item.email = email
    );
  }

  setFirstName(firstName: string): void {
    this.setValue(this.firstNameState,
      (item: UserUpdate) => item.firstName = firstName,
      () => this.item.firstName = firstName
    );
  }

  setLastName(lastName: string): void {
    this.setValue(this.lastNameState,
      (item: UserUpdate) => item.lastName = lastName,
      () => this.item.lastName = lastName
    );
  }

  setPassword(password: string): void {
    this.setValue(this.passwordState,
      (item: UserUpdate) => item.password = password,
      () => this.password = password.replace(/./gi, '*')
    );
  }

  setIsActive(isActive: boolean): void {
    this.setValue(this.isActiveState,
      (item: UserUpdate) => item.isActive = isActive,
      () => this.item.isActive = isActive
    );
  }

}
