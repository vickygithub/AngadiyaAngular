import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appLimitMobileNumber]'
})
export class LimitMobileNumberDirective {

  constructor(private el: ElementRef, @Optional() private ngModel: NgModel) { }
  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: string): void {
    if (String(value).length > 10) {
      this.el.nativeElement.value = String(value).slice(0, 10);
      // Update ngModel with the truncated value
      this.ngModel?.update.emit(value.slice(0, 10));
    }
  }
}
