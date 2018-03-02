import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lc-double-pane',
  templateUrl: './double-pane.component.html',
  styleUrls: ['./double-pane.component.scss']
})
export class DoublePaneComponent {

  private mouseAtMain: boolean = true;
  asideIsOpen: boolean = false;
  showMainCover: boolean = false;

  @ViewChild('aside')
  private asideElement: ElementRef;

  openAside(withMainCover: boolean = false): void {
    this.asideIsOpen = true;
    this.showMainCover = withMainCover;
    this.asideElement.nativeElement.focus();
  }

  closeAside(): void {
    this.asideIsOpen = false;
    this.showMainCover = false;
  }

  mouseEnterMain(): void {
    if (!this.mouseAtMain && !this.showMainCover) {
      this.asideIsOpen = false;
      this.mouseAtMain = true;
    }
  }

  mouseEnterAside(force: boolean = false): void {
    if (this.mouseAtMain) {
      this.asideIsOpen = true;
      this.mouseAtMain = false;
    }
  }
}
