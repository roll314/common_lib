import {
    Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[scroll]'
})
export class ScrollDirective {
    constructor(private _elementRef: ElementRef) {
    }

    @Output()
    public scroll = new EventEmitter<MouseEvent>();

    @HostListener('scroll', ['$event'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        this.scroll.emit(event);
    }
}
