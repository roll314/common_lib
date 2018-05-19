import {Component} from "@angular/core";
import {AbstractCellComponent} from "../AbstractCellComponent";

export class StyledCommonCellComponentData {
    constructor (
        public value: string,
        public style: { [name: string]: string },
        public title: string
    ) {}
}

@Component({
    selector: "styled-common-cell",
    template: `
        <span [ngStyle]="cellData.style" [title]="cellData.title">{{cellData.value}}</span>
    `,
    styleUrls: []
})
export class StyledCommonCellComponent extends AbstractCellComponent<any, StyledCommonCellComponentData> {

}
