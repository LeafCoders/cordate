import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

import * as moment from 'moment';
import 'moment/locale/sv';
moment.locale('sv');
moment.fn.toJSON = function () { return this.format('YYYY-MM-DDTHH:mm:ss'); }

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

