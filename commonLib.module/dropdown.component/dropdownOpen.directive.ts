import {Directive, ElementRef, OnDestroy, Host, HostListener} from "@angular/core";
import {DropdownDirective} from "./dropdown.directive";

@Directive({
    selector: "[dropdown-open]",
    exportAs: "dropdownOpen"
})
export class DropdownOpenDirective implements OnDestroy {

    /**
     * This hack is needed for dropdown not to open and instantly closed
     */
    private openedByFocus: boolean = false;

    private closeDropdownOnOutsideClick: (event: Event) => void;

    constructor(
        @Host()
        public dropdown: DropdownDirective,
        private elementRef: ElementRef
    ) {
        const _this = this;
        this.closeDropdownOnOutsideClick = function closeDropdownOnOutsideClick(event: MouseEvent) {
            _this.closeIfInClosableZone(event);
        };
    }

    toggle() {
        if (this.dropdown.isOpened()) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.dropdown.isOpened()) {
            return;
        }

        this.dropdown.open();
        document.addEventListener("click", this.closeDropdownOnOutsideClick, true);
    }

    close() {
        if (!this.dropdown.isOpened()) {
            return;
        }

        this.dropdown.close();
        document.removeEventListener("click", this.closeDropdownOnOutsideClick, true);
    }

    @HostListener("click", ["$event"])
    openDropdown(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.dropdown.activateOnFocus && this.openedByFocus) {
            this.openedByFocus = false;
            return;
        }

        if (this.dropdown.isOpened() && this.dropdown.toggleClick) {
            this.close();
        } else {
            this.open();
        }
    }

    @HostListener("keydown", ["$event"])
    dropdownKeydown(event: KeyboardEvent) {
        if (event.keyCode === 40) { // down
            this.openDropdown(event);
        }
    }

    @HostListener("focus")
    onFocus() {
        if (!this.dropdown.activateOnFocus) {
            return;
        }
        this.openedByFocus = true;
        this.dropdown.open();
        document.addEventListener("click", this.closeDropdownOnOutsideClick, true);
    }

    @HostListener("blur", ["$event"])
    onBlur(event: FocusEvent) {
        if (!this.dropdown.activateOnFocus) {
            return;
        }
        if (event.relatedTarget &&
            !this.dropdown.isInClosableZone(<HTMLElement> event.relatedTarget) &&
            event.relatedTarget !== this.elementRef.nativeElement) {

            this.dropdown.close();
            document.removeEventListener("click", this.closeDropdownOnOutsideClick, true);
        }
    }

    ngOnDestroy() {
        document.removeEventListener("click", this.closeDropdownOnOutsideClick, true);
    }

    private closeIfInClosableZone(event: Event) {
        if (!this.dropdown.isInClosableZone(<HTMLElement> event.target)
            && event.target !== this.elementRef.nativeElement
            && !this.elementRef.nativeElement.contains(event.target)) {
            this.dropdown.close();
            document.removeEventListener("click", this.closeDropdownOnOutsideClick, true);
        }
    }
}
