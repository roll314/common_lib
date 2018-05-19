import {
    Directive, ElementRef, Output, EventEmitter, OnInit
} from "@angular/core";

@Directive({
    selector: "[clickOutside]"
})
export class ClickOutsideDirective implements OnInit {

    ngOnInit(): void {
        if (!window["globalClickOutside"]) {
            window["globalClickOutside"] = [];

            document.addEventListener("click", (e: MouseEvent) => {
                // const before = window.performance.now();

                window["globalClickOutside"].forEach((item) => {
                    const clickedInside = item.el.nativeElement.contains(e.target);
                    if (!clickedInside) {
                        item.emitter.emit(e);
                    }
                });

                // const after = window.performance.now();
                // console.log(after - before);
            });
        }

        window["globalClickOutside"].push({
            emitter: this.clickOutside,
            el: this._elementRef
        });
    }

    constructor(private _elementRef: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter<MouseEvent>();

    /* @HostListener("document:click", ["$event", "$event.target"])
     public onClick(event: MouseEvent, targetElement: HTMLElement): void {
         event.stopPropagation();
         if (!targetElement) {
             return;
         }

         console.log("called");

         const clickedInside = this._elementRef.nativeElement.contains(targetElement);

         if (!clickedInside) {
             this.clickOutside.emit(event);
         }
     }*/
}
