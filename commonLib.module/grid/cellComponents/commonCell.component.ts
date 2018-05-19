import {Component} from "@angular/core";
import {AbstractCellComponent} from "../AbstractCellComponent";

@Component({
    selector: "common-cell",
    template: `
        {{cellData}}
    `,
    styleUrls: []
})
export class CommonCellComponent extends AbstractCellComponent<any, string> {
    cellData: string;
    data: any;
}
