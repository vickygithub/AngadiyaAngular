import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLimitMobileNumber]'
})
export class LimitMobileNumberDirective {

  constructor(private el: ElementRef) { }
  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: string): void {
    if (value.length > 10) {
      this.el.nativeElement.value = value.slice(0, 10);
    }
  }
}
