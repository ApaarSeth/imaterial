import { Directive, ElementRef, HostListener, Output, EventEmitter, HostBinding, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  @Output() onValueEvent = new EventEmitter();
  constructor(private renderer: Renderer2, private el: ElementRef) {
  }
  // @HostBinding('value') value: string = '';
  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: any) {
    // Allow Backspace, tab, end, and home keys
    // let key
    // let current

    // if (event.key === 'Unidentified') {
    //   key = event.currentTarget.value.slice(event.currentTarget.value.length - 1, event.currentTarget.value
    //     .length)
    //   current = event.currentTarget.value.slice(0, event.currentTarget.value.length - 1);
    // }
    // else {
    //   key = event.key;
    //   current = this.el.nativeElement.value;
    // }

    // if (!key) {
    //   event.preventDefault();
    //   return;
    // }

    // if (this.specialKeys.indexOf(key) !== -1) {
    //   return;
    // }

    // // let current: string = this.el.nativeElement.value;
    // const position = this.el.nativeElement.selectionStart;
    // const next: string = [current.slice(0, position), key == 'Decimal' ? '.' : key, current.slice(position)].join('');
    // if (next && !String(next).match(this.regex)) {
    //   // this.el.nativeElement.value = current;
    //   event.preventDefault();
    //   // this.value = current;
    //   // this.renderer.setValue(this.el.nativeElement, current)
    //   // this.onValueEvent.next(current)
    //   return
    // }

    let key;
    let current;
    if (event.data && event.data.length > 1) {
      key = event.data.slice(event.data.length - 1, event.data
        .length)
      current = event.data.slice(0, event.data.length - 1);
    }
    else if (event.data) {
      key = event.data;
      current = this.el.nativeElement.value
    }
    else {
      // event.preventDefault();
      return;
    }

    // if (this.specialKeys.indexOf(key) !== -1) {
    //   return;
    // }

    // let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionEnd;
    const next: string = [current.slice(0, position), key == 'Decimal' ? '.' : key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
      event.stopPropagation();
      // this.el.nativeElement.value = Number(current);
      return false;
    }
  }
} 