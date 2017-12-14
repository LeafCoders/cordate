import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RestApiService } from '../server/rest-api.service';
import { Resource, User, UserRef, ObjectRefsAndText } from '../server/rest-api.model';

interface UserSelect {
  user: User;
  selected: boolean;
}

@Component({
  selector: 'lc-user-resource-select',
  templateUrl: './user-resource-select.component.html',
  styleUrls: ['./user-resource-select.component.scss']
})
export class UserResourceSelectComponent implements OnInit {

  @Input() resource: Resource;
  @Output() saveResource: EventEmitter<ObjectRefsAndText<UserRef>> = new EventEmitter<ObjectRefsAndText<UserRef>>();

  showModal: boolean = false;
  users: Array<UserSelect> = [];
  optionalText: string;

  constructor(
    private api: RestApiService
  ) { }

  ngOnInit() {
    /* TODO
    this.api.read('api/users', { groupId: this.resource.resourceType.group.id })
      .subscribe(data => {
        this.users = data.json().map((user: any) => <UserSelect>{ user: user, selected: false });
        this.resource.users.refs.forEach((user: UserRef) => {
          let toSelect: UserSelect = this.users.find((u: UserSelect) => u.user.id === user.id);
          if (toSelect) {
            toSelect.selected = true;
          }
        });
      });
    */
  }

  selectUser(user: UserSelect): void {
    /* TODO
    if (this.resource.resourceType.multiSelect) {
      user.selected = !user.selected;
    } else {
      this.users.forEach((user: UserSelect) => user.selected = false);
      this.optionalText = undefined;
      user.selected = true;
    }
    */
  }

  selectOptionalText(): void {
    /* TODO
    if (!this.resource.resourceType.multiSelect) {
      this.users.forEach((user: UserSelect) => user.selected = false);
    }
    */
  }

  ok(): void {
    this.showModal = false;

    let result: ObjectRefsAndText<UserRef> = new ObjectRefsAndText<UserRef>({ refs: [], text: undefined }, UserRef);
    result.refs = this.users
      .filter((user: UserSelect) => user.selected)
      .map((user: UserSelect): UserRef => <UserRef>{ id: user.user.id, fullName: `${user.user.firstName} ${user.user.lastName}` });
    result.text = this.optionalText;
    this.saveResource.emit(result);
  }

  cancel(): void {
    this.ngOnInit();
    this.showModal = false;
  }
}
