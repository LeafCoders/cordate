import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Permission, PermissionLevel } from '../../shared/server/rest-api.model';

interface LevelData {
  text: string;
  level: number;
}

@Component({
  selector: 'lc-permission-new-dialog',
  templateUrl: './permission-new-dialog.component.html',
  styleUrls: ['./permission-new-dialog.component.scss']
})
export class PermissionNewDialogComponent {

  levels: Array<LevelData> = [
    { text: 'För alla (publikt)', level: PermissionLevel.PUBLIC },
    { text: 'För alla användare', level: PermissionLevel.ALL_USERS },
    { text: 'För en grupp', level: PermissionLevel.ONE_GROUP },
    { text: 'För en användare', level: PermissionLevel.ONE_USER },
  ]

  constructor(
    public dialogRef: MatDialogRef<PermissionNewDialogComponent>,
  ) {
  }

  selectLevel(level: LevelData): void {
    this.dialogRef.close({ level: level.level });
  }

}
