import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { UsersResource, UserUpdate } from '../shared/server/users.resource';
import { AuthService } from '../auth/auth.service';

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
    private authService: AuthService,
    dialog: MatDialog,
  ) {
    super(usersResource, dialog);
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
    let actions = [];
    const mayDelete: boolean = this.authPermission.isPermitted(this.usersResource.deletePermission(this.item));
    if (mayDelete) {
      actions.push(new EditorAction('Ta bort', true, () => this.deleteItem()));
    }
    if (this.hasAdminPermission) {
      actions.push(new EditorAction('Logga in som', true, () => this.loginAs()));
    }
    return actions;
  }

  private loginAs(): void {
    this.authService.loginAs(this.item.id).subscribe(userIdentity => {
      window.location.reload();
    });
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
