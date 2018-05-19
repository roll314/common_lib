import {Component} from "@angular/core";
import {AbstractHeaderComponent} from "../AbstractHeaderComponent";
import {SortOrder} from "../SortOrder";

@Component({
    selector: "common-header",
    template: `
        {{header}}
    `,
    styleUrls: []
})
export class CommonHeaderComponent extends AbstractHeaderComponent {

}
