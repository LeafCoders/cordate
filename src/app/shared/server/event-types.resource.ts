import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { EventType, ResourceTypeRef } from './rest-api.model';

export interface EventTypeUpdate {
  id: number;
  idAlias: string;
  name: string;
  description: string;
  isPublic: boolean;
}

@Injectable()
export class EventTypesResource extends DefaultBaseResource<EventType, EventTypeUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'eventTypes');
  }

  newInstance(data?: any): EventType {
    return new EventType(data ? data : { isPublic: true });
  }

  updateInstance(from: EventType): EventTypeUpdate {
    if (from.id) {
      return <EventTypeUpdate>{ id: from.id };
    } else {
      return <EventTypeUpdate>{
        isPublic: from.isPublic,
      };
    }
  }

  addResourceType(eventType: EventType, resourceTypeId: number): Observable<void> {
    return this.api.create<any[]>(`api/eventTypes/${eventType.id}/resourceTypes/${resourceTypeId}`).pipe(
      map((data): void => {
        eventType.resourceTypes = data.map(item => new ResourceTypeRef(item));
        this.replaceUpdated(eventType);
      })
    );
  }

  removeResourceType(eventType: EventType, resourceTypeId: number): Observable<void> {
    return this.api.delete<any[]>(`api/eventTypes/${eventType.id}/resourceTypes/${resourceTypeId}`).pipe(
      map((data): void => {
        eventType.resourceTypes = data.map(item => new ResourceTypeRef(item));
        this.replaceUpdated(eventType);
      })
    );
  }

}
