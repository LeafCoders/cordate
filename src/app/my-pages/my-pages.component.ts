import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

import { User } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-my-pages',
  styles: [':host { background-color: white; flex: 100%; }'],
  templateUrl: './my-pages.component.html'
})
export class MyPagesComponent {
}
