import { Component, Input } from '@angular/core';

@Component({
  selector: 'lc-drag-handle',
  templateUrl: './drag-handle.component.html',
  styleUrls: ['./drag-handle.component.scss']
})
export class DragHandleComponent {

  @Input() icon: string;
}
