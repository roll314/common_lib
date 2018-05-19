import {Component, OnInit, OnDestroy, TemplateRef, ContentChild, EmbeddedViewRef, ViewContainerRef, Input} from "@angular/core";

@Component({
    selector: "multiselect-dropdown-item",
    template: ``
})

export class ItemComponent {
    @ContentChild(TemplateRef)
    template: TemplateRef<any>;

    constructor() {
    }
}


@Component({
    selector: "multiselect-dropdown-bubble",
    template: ``
})

export class BubbleComponent {
    @ContentChild(TemplateRef)
    template: TemplateRef<any>;

    constructor() {
    }
}


@Component({
    selector: "multiselect-dropdown-template-renderer",
    template: ``
})

export class TemplateRendererComponent implements OnInit, OnDestroy {

    @Input()
    data: any;
    @Input()
    item: any;
    view: EmbeddedViewRef<any>;

    constructor(public viewContainer: ViewContainerRef) {
    }

    ngOnInit() {
        this.view = this.viewContainer.createEmbeddedView(this.data.template, {
            "\$implicit": this.data,
            "item": this.item
        });
    }

    ngOnDestroy() {
        this.view.destroy();
    }

}
