import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { Event } from '../server/rest-api.model';

@Component({
  selector: 'lc-description-editor',
  templateUrl: './description-editor.component.html',
  styleUrls: ['./description-editor.component.scss']
})
export class DescriptionEditorComponent implements OnInit, OnChanges {

  @Input('description') inDescription: string;
  @Input() event: Event;
  @Output() saveDescription: EventEmitter<string> = new EventEmitter<string>();

  showModal: boolean = false;
  description: string;
  compiledInDescription: string;

  constructor() { }

  ngOnInit() {
    this.description = this.inDescription;
    this.compiledInDescription = this.compileText(this.inDescription);
  }

  ngOnChanges(data: any) {
    this.description = this.inDescription;
    this.compiledInDescription = this.compileText(this.inDescription);
  }

  representation(): string {
    return this.compiledInDescription;
  }

  ok(): void {
    this.showModal = false;
    this.saveDescription.emit(this.description);
  }

  cancel(): void {
    this.showModal = false;
  }

  private compileText(text: string): string {
    return '<b>' + text + '</b>';
  }
}
