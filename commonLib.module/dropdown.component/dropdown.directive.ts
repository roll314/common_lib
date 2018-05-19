 import {Directive, ElementRef, ContentChild, Output, EventEmitter, Input, OnInit} from "@angular/core";
import {DropdownNotClosableZoneDirective} from "./dropdownNotClosableZone.directive";

export type DropDownListPosition = "left" | "right" | "auto";

@Directive({
    selector: "[dropdown]",
    exportAs: "dropdown"
})
export class DropdownDirective implements OnInit {
    @Input("dropdownToggle")
    toggleClick: boolean = true;

    @Input("dropdownFocusActivate")
    activateOnFocus: boolean = false;

    @Input("dropDownListPosition")
    dropDownListPosition: DropDownListPosition = "left";

    @Input()
    public positionFixed: boolean = false;

    @Input()
    public appendToBody: boolean = false;

    @Input()
    public disabled: boolean = false;

    @Input("dropDownClosed")
    set dropDownClosed(value: boolean) {
        if (value) {
            this.close();
        }
    }

    @Output()
    onOpen = new EventEmitter<any>();

    @Output()
    onClose = new EventEmitter<any>();

    @Output()
    onChange = new EventEmitter<boolean>();

    @ContentChild(DropdownNotClosableZoneDirective)
    notClosableZone: DropdownNotClosableZoneDirective;

    private _dropdownMenu: HTMLElement;
    private _dropdownOpen: HTMLElement;

    constructor(
        private elementRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.initElements();
    }

    private initElements() {
        this._dropdownMenu = this.elementRef.nativeElement.querySelector("[dropdown-menu]");
        this._dropdownOpen = this.elementRef.nativeElement.querySelector("[dropdown-open]");
    }

    private setDropdownMenuVisibility(visibility: boolean) {
        if (!this._dropdownMenu) {
            return;
        }

        if (visibility) {
            this._dropdownMenu.classList.add("dropdown-menu-opened");
            this._dropdownMenu.style.display = "block";
        } else {
            this._dropdownMenu.classList.remove("dropdown-menu-opened");
            this._dropdownMenu.style.display = "none";
        }
    }

    public open() {
        if (this.disabled) {
            return;
        }

        const elementDropdownList: HTMLElement = <HTMLElement> Array.from(this.elementRef.nativeElement.children)
            .filter((e: HTMLElement) => e.attributes.getNamedItem("dropdown-menu"))[0];
        if (elementDropdownList) {
            switch (this.dropDownListPosition) {
                case "auto":
                    const clientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
                    if (clientRect.left < window.innerWidth / 2) {
                        elementDropdownList.style.left = "0";
                        elementDropdownList.style.right = "initial";
                    } else {
                        elementDropdownList.style.left = "initial";
                        elementDropdownList.style.right = "0";
                    }
                    break;
                case "left":
                    elementDropdownList.style.left = "0";
                    elementDropdownList.style.right = "initial";
                    break;
                case "right":
                    elementDropdownList.style.left = "initial";
                    elementDropdownList.style.right = "0";
                    break;
            }
        }

        if (this.appendToBody) {
            if (this._dropdownMenu && this._dropdownOpen) {

                const clientRect: ClientRect = this._dropdownOpen.getBoundingClientRect();

                this._dropdownMenu.style.position =  this.positionFixed ? "fixed" : "absolute";
                this._dropdownMenu.style.top = clientRect.top + clientRect.height + "px";
                this._dropdownMenu.style.left = clientRect.left + "px";

                document.body.appendChild(this._dropdownMenu);
            }
        }

        this.setDropdownMenuVisibility(true);

        this.onChange.emit(true);
        this.onOpen.emit(undefined);
    }

    public close() {
        this.setDropdownMenuVisibility(false);
        this.onChange.emit(false);
        this.onClose.emit(undefined);
    }

    public isOpened() {
        if (!this._dropdownMenu) {
            return false;
        }
        return this._dropdownMenu.classList.contains("dropdown-menu-opened");
    }

    public isInClosableZone(element: HTMLElement) {
        if (!this.notClosableZone) {
            return false;
        }

        return this.notClosableZone.contains(element);
    }
}
