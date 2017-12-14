import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { RestApiService } from '../server/rest-api.service';
import { IdModel, Location, ObjectRefOrText, User, createArrayObjects } from '../server/rest-api.model';

@Component({
  selector: 'lc-object-select',
  templateUrl: './object-select.component.html',
  styleUrls: ['./object-select.component.scss']
})
export class ObjectSelectComponent implements OnInit, OnChanges {

  @Input() objectType: string;
  @Input() allowText: boolean;
  @Input('selectedObjectOrText') inObjectOrText: ObjectRefOrText<IdModel>;
  @Input('selectedObject') inObject: IdModel;
  @Output() saveObjectOrText: EventEmitter<ObjectRefOrText<IdModel>> = new EventEmitter<ObjectRefOrText<IdModel>>();
  @Output() saveObject: EventEmitter<IdModel> = new EventEmitter<IdModel>();

  showModal: boolean = false;
  objects: Array<IdModel> = [];
  selectedObject: IdModel;
  selectedText: string;

  constructor(
    private api: RestApiService
  ) { }

  ngOnInit() {
    this.setFromInput();
    this.api.read(`api/${ this.objectType }s`)
      .subscribe(data => {
        this.objects = createArrayObjects(data.json(), this.objectType);
      });
  }

  ngOnChanges(data: any) {
    this.showModal = false;
    this.setFromInput();
  }

  private setFromInput(): void {
    if (this.inObjectOrText) {
      this.selectedObject = this.inObjectOrText.ref;
      this.selectedText = this.inObjectOrText.text;
    } else {
      this.selectedObject = this.inObject;
    }
  }

  representation(): string {
    if (this.inObjectOrText && this.inObjectOrText.text) {
      return this.inObjectOrText.text;
    } else {
      let obj: IdModel = this.inObjectOrText ? this.inObjectOrText.ref : this.inObject;
      return obj ? obj.asText() : '';
    }
  }

  selectObject(object: IdModel): void {
    this.selectedObject = object;
    this.selectedText = undefined;
  }

  selectText(): void {
    this.selectedObject = undefined;
  }

  ok(): void {
    this.showModal = false;
    if (this.inObjectOrText) {
      this.saveObjectOrText.emit(<ObjectRefOrText<IdModel>>{
        ref: this.selectedObject,
        text: this.selectedText
      });
    } else {
      this.saveObject.emit(<IdModel>this.selectedObject);
    }
  }

  cancel(): void {
    this.showModal = false;
  }
}
