import { Component } from '@angular/core';
import { UserIdentity } from '../../current-user.service';
import { MatDialogRef } from '@angular/material/dialog';

export interface Message {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'lc-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.scss']
})
export class SendMessageDialogComponent {

  fromUser: UserIdentity;
  subject: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<SendMessageDialogComponent, Message>,
  ) {
  }

  ok(): void {
    if (this.message && this.message.length > 0) {
      this.dialogRef.close({
        fromName: this.fromUser.fullName,
        fromEmail: this.fromUser.email,
        subject: this.subject,
        message: this.message,
      });
    }
  }

}
