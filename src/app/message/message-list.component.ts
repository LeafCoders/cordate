import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { MessagesResource } from '../shared/server/messages.resource';
import { Message, MessageList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-message-list',
  templateUrl: './message-list.component.html'
})
export class MessageListComponent extends BaseList<Message> {

  constructor(
    private messagesResource: MessagesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(messagesResource, () => messagesResource.list());
  }

  protected init(): void {
  }

}
