import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { Message, IdModel } from './rest-api.model';

import * as moment from 'moment';

export interface MessageUpdate {
  id: number;
  key: string;
  message: string;
}

@Injectable()
export class MessagesResource extends DefaultBaseResource<Message, MessageUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'messages');
  }

  newInstance(data?: any): Message {
    return new Message(data ? data : {});
  }

  updateInstance(from: Message): MessageUpdate {
    if (from.id) {
      return <MessageUpdate>{ id: from.id }
    } else {
      return <MessageUpdate>{};
    }
  }

}
