import { ContentChild, Component, Directive, ElementRef, EventEmitter, Input, Output, QueryList, Renderer, TemplateRef, ViewContainerRef, HostBinding } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[lc-list-item]',
})
export class ListItemDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  // Will use global class 'list-item'. Not so nice...
  @HostBinding('class.list-item')
  private alwaysClass: boolean = true;

  @Input()
  set clickable(enable: boolean) {
    this.renderer.setElementClass(this.elementRef.nativeElement, 'with-hover', enable);
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

  @ContentChild(ListActionsDirective) actions: QueryList<ListActionsDirective>;
}
