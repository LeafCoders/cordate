import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { BaseResource } from './base.resource';
import { Location, LocationList } from './rest-api.model';

@Injectable()
export class LocationsResource {

  private baseResource: BaseResource<Location, any>;
  private cachedLocations: LocationList = [];

  constructor(
    private api: RestApiService,
  ) {
    this.baseResource = new BaseResource<Location, any>(undefined);
  }

  list(reload: boolean = false): Observable<LocationList> {
    if (!reload && this.cachedLocations.length) {
      return of(this.cachedLocations);
    }
    return this.api.read<any[]>(`api/locations`).pipe(
      map((data): LocationList => {
        this.cachedLocations = data.map(item => new Location(item))
        return this.cachedLocations;
      })
    );
  }
}