import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PermissionsResource, PermissionUpdate } from '../shared/server/permissions.resource';
import { GroupsResource } from '../shared/server/groups.resource';
import { UsersResource } from '../shared/server/users.resource';
import { Permission, IdModel, Group, User, PermissionLevel, PermissionSet, PermissionSetRef, PermissionSetRefList } from '../shared/server/rest-api.model';
import { PermissionSetsResource } from '../shared/server/permission-sets.resource';
import { PermissionWizardDialogComponent } from '../shared/dialog/permission-wizard-dialog/permission-wizard-dialog.component';
import { TextEditorComponent } from '../shared/editor/text-editor/text-editor.component';

@Component({
  selector: 'lc-permission-editor',
  templateUrl: './permission-editor.component.html'
})
export class PermissionEditorComponent extends BaseEditor<Permission, PermissionUpdate> {

  @ViewChild('permissionEditor') permissionEditor: TextEditorComponent;

  nameState: EditorState = new EditorState();
  entityState: EditorState = new EditorState();
  patternsState: EditorState = new EditorState();

  allPermissionSets: PermissionSetRefList = [];
  permissionSetsNotInPermission: PermissionSetRefList = [];

  constructor(
    private authPermission: AuthPermissionService,
    private permissionsResource: PermissionsResource,
    private permissionSetsResource: PermissionSetsResource,
    private groupsResource: GroupsResource,
    private usersResource: UsersResource,
    dialog: MatDialog,
  ) {
    super(permissionsResource, dialog);

    this.permissionSetsResource.list().subscribe(permissionSet => {
      this.allPermissionSets = permissionSet.map(r => r.asRef());
      this.refreshPermissionSetNotInResource();
    });
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
    this.refreshPermissionSetNotInResource();
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

  addPermissionSet(permissionSet: PermissionSetRef): void {
    this.permissionsResource.addPermissionSet(this.item, permissionSet.id).subscribe(() => this.refreshPermissionSetNotInResource());
  }

  removePermissionSet(permissionSet: PermissionSetRef): void {
    this.permissionsResource.removePermissionSet(this.item, permissionSet.id).subscribe(() => this.refreshPermissionSetNotInResource());
  }

  private refreshPermissionSetNotInResource(): void {
    this.permissionSetsNotInPermission = this.item ? PermissionSetRef.restOf<PermissionSetRef>(this.allPermissionSets, this.item.permissionSets) : [];
  }

  showPermissionWizard(): void {
    this.dialog.open(PermissionWizardDialogComponent).afterClosed().subscribe(data => {
      if (data) {
        this.permissionEditor.appendToValue(data);
      }
    });
  }
}
