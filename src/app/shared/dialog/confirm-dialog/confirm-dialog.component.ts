import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'lc-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  title: string;
  message: string;
  confirmTitle: string;
  destructive: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {
  }

  init(title: string, message: string, confirmTitle: string, destructive: boolean, onConfirm: () => void): void {
    this.title = title;
    this.message = message;
    this.confirmTitle = confirmTitle;
    this.destructive = destructive;
    this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        onConfirm();
      }
    });
  }

}
