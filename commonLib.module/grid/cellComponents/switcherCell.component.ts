import {Component} from "@angular/core";
import {AbstractCellComponent} from "../AbstractCellComponent";

export type SwitcherCellComponentChangeType<T> = (data: T, value: boolean) => void;

export class SwitcherCellComponentData<T = any> {
    constructor(
        public state: boolean,
        public change: SwitcherCellComponentChangeType<T> = null
    ) {}
}

@Component({
    selector: "switcher-cell",
    template: `
        <switcher [(ngModel)]="cellData" (change)="change($event)"></switcher>
    `,
    styleUrls: []
})
export class SwitcherCellComponent<T = any> extends AbstractCellComponent<T, SwitcherCellComponentData> {
    public change(value: boolean) {
        if (!this.cellData.change) {
            return;
        }
        this.cellData.state = value;

        this.cellData.change(this.data, value);
    }
}
