import { ContentChild, Component, Directive, ElementRef, Input, QueryList, Renderer2, TemplateRef, ViewContainerRef, HostBinding } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[lc-list-item]',
})
export class ListItemDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  // Will use global class 'list-item'. Not so nice...
  @HostBinding('class.list-item')
  public alwaysClass: boolean = true;

  @Input()
  set clickable(enable: boolean) {
    if (enable) {
      this.renderer.addClass(this.elementRef.nativeElement, 'with-hover');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'with-hover');
    }
  }
}

@Directive({
  selector: '[lc-list-actions]',
})
export class ListActionsDirective extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  selector: 'lc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() header: string;
  @Input() scrollable: boolean = false;

  @ContentChild(ListActionsDirective, { static: false }) actions: QueryList<ListActionsDirective>;
}
