import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { SendMessageDialogComponent, Message } from "./send-message-dialog.component";
import { CurrentUserService } from "../../current-user.service";
import { RestApiService } from "../../server/rest-api.service";
import { RestApiErrorService } from "../../server/rest-api-error.service";

@Injectable()
export class SendMessageDialogService {

  private dialogRef: MatDialogRef<SendMessageDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private currentUser: CurrentUserService,
    private api: RestApiService,
  ) { }

  showDialog(subject: string, staticText: string): void {
    this.dialogRef = this.dialog.open(SendMessageDialogComponent);
    this.dialogRef.componentInstance.fromUser = this.currentUser.user;
    this.dialogRef.componentInstance.subject = subject;

    this.dialogRef.afterClosed().subscribe((message: Message) => {
      if (message) {
        message.message = `${staticText}\n\n${message.message}`;
        this.api.create('api/sendmessages/helprequest', {}, message).subscribe(() => {
          alert("Meddelandet har skickats!");
        });
      }
    });
  }

}