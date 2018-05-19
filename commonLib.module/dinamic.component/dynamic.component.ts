import {Component, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {DynamicComponentCreationService} from "./dynamicComponentCreation.service";

export abstract class AbstractDynamicComponent {}

@Component({
    selector: "ng-dynamic",
    template: `
        <ng-template #dynamic></ng-template>
    `,
    styleUrls: []
})
export class DynamicComponent implements OnInit {
    @Input()
    componentType:  new() => AbstractDynamicComponent;

    @Input()
    inputData: { [name: string]: any } = {};

    @ViewChild("dynamic", { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

    constructor(
        private dynamicComponentCreationService: DynamicComponentCreationService
    ) {
    }

    ngOnInit() {
        this.dynamicComponentCreationService.setRootViewContainerRef(this.viewContainerRef);
        this.dynamicComponentCreationService.addDynamicComponent(this.componentType, this.inputData);
    }
}
