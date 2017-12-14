import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { RestApiErrorService } from '../../shared/server/rest-api-error.service';
import { RestApiError } from '../../shared/server/rest-api-error.model';

@Component({
  selector: 'lc-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private apiError: RestApiErrorService
  ) {
  }

  ngOnInit() {
    this.subscription = this.apiError.subject().subscribe(this.showError.bind(this));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  private showError(error: RestApiError): void {
    if (error.isValidataionError()) {
      this.snackBar.open(error.getFirstValidationError(), 'OK', { duration: 5000 });
    } else {
      this.snackBar.open(error.getError(), 'MER', { duration: 5000 }).onAction().subscribe(() => alert(error.getReason()));
    }
  }

}