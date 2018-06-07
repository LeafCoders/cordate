import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, EventType, ResourceTypeRef } from './rest-api.model';
import { pipe } from '@angular/core/src/render3/pipe';

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
    return <EventTypeUpdate>{ id: from.id };
  }

  addResourceType(eventType: EventType, resourceTypeId: number): Observable<void> {
    return this.api.create<any[]>(`api/eventTypes/${eventType.id}/resourceTypes/${resourceTypeId}`).pipe(
      map((data): void => {
        eventType.resourceTypes = data.map(item => new ResourceTypeRef(item));
      })
    );
  }

  removeResourceType(eventType: EventType, resourceTypeId: number): Observable<void> {
    return this.api.delete<any[]>(`api/eventTypes/${eventType.id}/resourceTypes/${resourceTypeId}`).pipe(
      map((data): void => {
        eventType.resourceTypes = data.map(item => new ResourceTypeRef(item));
      })
    );
  }

}
