import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('beforeinput', ['$event'])
  onKeyDown(event: any) {
    // Allow Backspace, tab, end, and home keys
    const key = event.data.slice(event.data.length - 1, event.data.length)
    if (!key) {
      event.preventDefault();

      return;
    }

    if (this.specialKeys.indexOf(key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionEnd;
    const next: string = [current.slice(0, position), key == 'Decimal' ? '.' : key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      // this.el.nativeElement.value = current;
      return false;
    }
  }


} 