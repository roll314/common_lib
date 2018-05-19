import {Component} from "@angular/core";
import {AbstractCellComponent} from "../AbstractCellComponent";

export type IconCellComponentClickType<T> = (event: Event, data: T) => void;

export class IconCellComponentData<T = any> {
    constructor(
        public iconClass: string,
        public title: string = null,
        public click: IconCellComponentClickType<T> = null
    ) {}
}

@Component({
    selector: "icon-cell",
    template: `
        <i [class]="cellData.iconClass" [title]="cellData.title" (click)="click($event)"></i>
    `,
    styleUrls: []
})
export class IconCellComponent<T = any> extends AbstractCellComponent<T, IconCellComponentData<T>> {
    public click(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.cellData.click) {
            return;
        }

        this.cellData.click(event, this.data);
    }
}
