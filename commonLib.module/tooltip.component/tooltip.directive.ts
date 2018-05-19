import {
    Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver,
    ComponentFactory, EmbeddedViewRef
} from "@angular/core";
import {TooltipContentComponent} from "./tooltipСontent.component";

@Directive({
    selector: "[tooltip]"
})
export class TooltipDirective {

    private tooltip: ComponentRef<TooltipContentComponent>;
    private visible: boolean;

    constructor(private viewContainerRef: ViewContainerRef,
                private resolver: ComponentFactoryResolver) {
    }

    @Input("tooltip")
    content: string|TooltipContentComponent;

    @Input()
    tooltipDisabled: boolean;

    @Input()
    tooltipAnimation: boolean = true;

    @Input()
    tooltipAppendToBody: boolean = true;

    @Input()
    tooltipPlacement: "top"|"bottom"|"left"|"right" = "bottom";

    @HostListener("focusin")
    @HostListener("mouseenter")
    show(): void {
        if (this.tooltipDisabled || this.visible)
            return;

        this.visible = true;
        if (typeof this.content === "string") {
            const factory = this.resolver.resolveComponentFactory(TooltipContentComponent);
            if (!this.visible)
                return;

            this.tooltip = this.viewContainerRef.createComponent(factory);



            if (this.tooltipAppendToBody) {
                const domElem: HTMLElement = (this.tooltip.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
                document.body.appendChild(domElem);
            }

            this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
            this.tooltip.instance.content = this.content as string;
            this.tooltip.instance.placement = this.tooltipPlacement;
            this.tooltip.instance.animation = this.tooltipAnimation;
            this.tooltip.instance.appendToBody = this.tooltipAppendToBody;
        } else {
            const tooltip = this.content as TooltipContentComponent;
            tooltip.hostElement = this.viewContainerRef.element.nativeElement;
            tooltip.placement = this.tooltipPlacement;
            tooltip.animation = this.tooltipAnimation;
            tooltip.appendToBody = this.tooltipAppendToBody;
            tooltip.show();
        }
    }

    @HostListener("focusout")
    @HostListener("mouseleave")
    hide(): void {
        if (!this.visible)
            return;

        this.visible = false;
        if (this.tooltip)
            this.tooltip.destroy();

        if (this.content instanceof TooltipContentComponent)
            (this.content as TooltipContentComponent).hide();
    }

}