import {Component} from "@angular/core";
import {AbstractCellComponent} from "../AbstractCellComponent";

export class DropDownActionComponentData<T> {
    constructor(
        public data: T,
        public iconClass: string,
        public text: string,
        public itemClick: (event: Event, data: T) => void
    ) {}
}

export function redirectTo(url: string) {
    return () => window.location.href = url;
}

export function openNewTab(url: string, target: string = "_blank") {
    return () => window.open(url, target);
}

@Component({
    selector: "drop-down-action-cell",
    template: `
        <div class="dropdown" dropdown dropDownListPosition="right">
             <span dropdown-open class="cursor-pointer">
                 <i class="icon-menu9"></i>
             </span>
            <ul class="dropdown-menu" dropdown-menu>
                <li *ngFor="let item of cellData">
                    <a class="cursor-pointer" (click)="click($event, item)">
                        <i [class]="item.iconClass"></i> {{item.text}}
                    </a>
                </li>
            </ul>
        </div>
    `,
    styleUrls: []
})
export class DropDownActionComponent<T = any> extends AbstractCellComponent<any, DropDownActionComponentData<T>[]> {

    public click(event: Event, item: DropDownActionComponentData<T>) {
        event.preventDefault();
        event.stopPropagation();

        if (!item.itemClick) {
            return;
        }

        item.itemClick(event, item.data);
    }
}
