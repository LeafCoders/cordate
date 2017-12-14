import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { EditorState } from '../editor-state';
import { IdModel, Location, ObjectRefOrText } from '../../server/rest-api.model';
import { LocationsResource } from '../../server/locations.resource';


@Component({
  selector: 'lc-ref-or-text-editor',
  templateUrl: './ref-or-text-editor.component.html'
})
export class RefOrTextEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<ObjectRefOrText<IdModel>> = new EventEmitter<ObjectRefOrText<IdModel>>();

  private refType: string;
  private value: ObjectRefOrText<IdModel>;
  private refs: Array<any>;
  private refOrTextDialogRef: MatDialogRef<RefOrTextDialog>;

  constructor(
    private locationsResource: LocationsResource,
    private dialog: MatDialog
  ) { }

  @Input('refType')
  set inRefType(inRefType: string) {
    this.refType = inRefType;
    if (inRefType === 'location') {
      this.locationsResource.list().subscribe((locations) => this.refs = locations);
    }
  }

  @Input('value')
  set inValue(inValue: ObjectRefOrText<IdModel>) {
    this.value = inValue;
  }

  refSelected(ref: IdModel): void {
    let model: ObjectRefOrText<IdModel> = new ObjectRefOrText<IdModel>();
    model.ref = ref;
    this.changed.emit(model);
  }

  textSelected(ref: IdModel): void {
    this.refOrTextDialogRef = this.dialog.open(RefOrTextDialog);
    this.refOrTextDialogRef.componentInstance.text = this.value.text;

    this.refOrTextDialogRef.afterClosed().subscribe((result: string) => {
      this.refOrTextDialogRef = null;
      if (result !== undefined) {
        let model: ObjectRefOrText<IdModel> = new ObjectRefOrText<IdModel>();
        model.text = result;
        this.changed.emit(model);
      }
    });
  }

  clear(): void {
    this.changed.emit(new ObjectRefOrText<IdModel>());
  }
}

@Component({
  template: `
    <p>Ange fritext om det saknades i listan</p>
    <div><mat-form-field><input matInput style="width: 100%;" #names [value]="text"></mat-form-field></div>
    <div style="text-align: right">
      <button mat-button (click)="dialogRef.close()">Avbryt</button>
      <button mat-button (click)="dialogRef.close(names.value)" color="primary">Spara</button>
    </div>`
})
export class RefOrTextDialog {

  text: string;

  constructor(public dialogRef: MatDialogRef<RefOrTextDialog>) { }
}