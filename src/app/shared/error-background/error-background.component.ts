import { Component, Input } from '@angular/core';

@Component({
  selector: 'lc-error-background',
  templateUrl: './error-background.component.html',
  styleUrls: ['./error-background.component.scss']
})
export class ErrorBackgroundComponent {
  @Input() icon: string;
  @Input() text: string;
}
