import {
    Component, OnInit, ViewChild,
    ViewContainerRef
} from "@angular/core";
import {animate, animateChild, query, state, style, transition, trigger, group} from "@angular/animations";

const animationSpeed: number = 250;

export interface IModalSettings {
    absolute: boolean;
}

@Component({
    selector: "modal",
    template: `
        <div
                class="m-modal-backdrop"
                [style.z-index]="zIndex - 1"
                [ngClass]="{'m-absolute': settings.absolute, 'm-fixed': !settings.absolute}"
                [@modalBackdropColor]="animationState"
                (@modalBackdropColor.done)="animationDone()">
            <div
                    [@modalShow]="animationState"
                    class="m-modal"
                    [style.z-index]="zIndex"
                    [ngClass]="{'m-absolute': settings.absolute, 'm-fixed': !settings.absolute}">
                <div class="m-modal-body" #modalBody>
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .m-absolute {
            position: absolute;
        }
        
        .m-fixed {
            position: fixed;
        }
        
        .m-modal {
            transform: translate(-50%);
            top: 0;
            left: 50%;
            right: initial;
            bottom: initial;
            display: block;
        }

        .m-modal-body {
            position: static;
            opacity: 1;
            padding: 0;
        }

        .m-modal-backdrop {
            cursor: default;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 1;
        }
    `],
    animations: [
        trigger("modalShow", [
            state("shown", style({ top: "10%", opacity: 1 })),
            state("void", style({ top: "0%", opacity: 0 })),
            state("hidden", style({ top: "0%", opacity: 0 })),
            transition("void => shown", animate( animationSpeed)),
            transition("shown => hidden", animate( animationSpeed)),
            transition("shown => void", animate( animationSpeed)),
        ]),
        trigger("modalBackdropColor", [
            state("shown", style({ "background-color": "rgba(0, 0, 0, 0.75)" })),
            state("hidden", style({  "background-color": "*" })),
            state("void", style({  "background-color": "*" })),
            transition("void => shown",
                group([
                    animate(animationSpeed, style({ "background-color": "rgba(0, 0, 0, 0.75)" })),
                    query("@modalShow", animateChild())
                ])
            ),
            transition("shown => hidden",
                group([
                    animate(animationSpeed, style({ "background-color": "*" })),
                    query("@modalShow", animateChild())
                ])
            ),
            transition("shown => void",
                group([
                    animate(animationSpeed, style({ "background-color": "*" })),
                    query("@modalShow", animateChild())
                ])
            )
        ])
    ]
})
export class ModalComponent implements OnInit {

    public animationState: string = "shown";

    private readonly initialZIndex: number = 1000;

    public get zIndex(): number {
        return document.getElementsByClassName("m-modal-backdrop").length + this.initialZIndex;
    }

    @ViewChild("modalBody", { read: ViewContainerRef})
    public modalContent: ViewContainerRef;

    public settings: IModalSettings = <IModalSettings> {
        absolute: false
    };

    public onAnimationDone: () => void;

    ngOnInit(): void {

    }

    animationDone() {
        if (this.onAnimationDone) {
            this.onAnimationDone();
        }
    }

    constructor() {}

    public close(onAnimationDone: () => void) {
        this.onAnimationDone = onAnimationDone;
        this.animationState = "hidden";
    }
}
