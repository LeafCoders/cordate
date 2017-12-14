import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SignalService {

  private openSideNav = new Subject<boolean>();
  openSideNavRequested$ = this.openSideNav.asObservable();
  requestOpenSideNav() {
    this.openSideNav.next();
  }
}
