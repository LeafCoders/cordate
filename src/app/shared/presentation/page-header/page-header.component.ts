import { Component, Input } from '@angular/core';

import { SignalService } from '../../signal.service';

@Component({
  selector: 'lc-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  @Input() title: string;
  @Input() isLoading: boolean;
  @Input() failedToLoad: boolean;

  constructor(private signalService: SignalService) {
  }

  openSideNav(): void {
    this.signalService.requestOpenSideNav();
  }
}
