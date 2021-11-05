import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[content-pop]'
})
export class ContentPopDirective {
  el: ElementRef;
  constructor(el: ElementRef) {
    console.log(el);
  }
}
