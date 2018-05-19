import {Directive, ElementRef, Input, OnChanges, OnInit} from "@angular/core";

@Directive({
    selector: '[styleProp]'
})
export class StyleDirective implements OnInit, OnChanges {

    constructor(private el: ElementRef) {

    }

    @Input('styleProp') styleVal: number;

    ngOnInit() {

        this.el.nativeElement.style.top = this.styleVal;
    }

    ngOnChanges(): void {
        this.el.nativeElement.style.top = this.styleVal;
    }
}
