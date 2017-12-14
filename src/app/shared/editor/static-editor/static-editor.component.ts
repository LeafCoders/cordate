import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lc-static-editor',
  templateUrl: './static-editor.component.html',
  styleUrls: ['./static-editor.component.scss']
})
export class StaticEditorComponent {

  @Input() valueTitle: string;
  @Input() icon: string;
}
