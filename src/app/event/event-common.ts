import * as moment from 'moment';

import { ResourceTypeRef } from '../shared/server/rest-api.model';


export interface FilterItem {
  text: string;
  resourceType?: ResourceTypeRef;
  disabled?: boolean;
}

export const NONE_FILTER: FilterItem = { text: 'Inget' };

export interface ShowFrom {
  text: string;
  from: moment.Moment;
  before?: moment.Moment;
}

export const LAST_WEEK: ShowFrom = { text: 'Förra veckan', from: moment().startOf('isoWeek').add(-1, 'week') };
