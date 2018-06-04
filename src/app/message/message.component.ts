import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { MessagesResource } from '../shared/server/messages.resource';
import { Message } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-message',
  templateUrl: './message.component.html'
})
export class MessageComponent extends BaseContainer<Message> {

  constructor(
    private messagesResource: MessagesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(messagesResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.messagesResource.createPermission());
  }
}
