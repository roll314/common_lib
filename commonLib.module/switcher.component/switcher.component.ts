import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {animate, AnimationBuilder, AnimationPlayer, style} from "@angular/animations";
import {AnimationStyleMetadata} from "@angular/animations/src/animation_metadata";
import {AnimationFactory} from "@angular/animations/src/animation_builder";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const noop = () => {};

@Component({
    selector: "switcher",
    template: `
        <span style="cursor: pointer;" (click)="click($event)">
            <span #bar
                  style="display: inline-block; position: relative;"
                  [style.margin-top.px]="height * 0.25 + 2"
                  [style.background-color]="getColor(value)"
                  [style.width.px]="width"
                  [style.height.px]="height"
                  [style.top.px]="height * 0.5"
                  [style.border-radius.px]="height / 2">
                <span
                        #circle
                        class="circle"
                        [style.width.px]="height * 1.5"
                        [style.height.px]="height * 1.5"
                        [style.border-radius.px]="height * 0.75"
                        [style.top.px]="-height * 0.25"
                        [style.left.px]="getLeft(value)"
                        [style.border-color]="getColor(value)">
                </span>
            </span>
        </span>
        <span style="vertical-align: text-bottom;">
            <ng-content></ng-content>
        </span>
    `,
    styles: [
        `
            .circle {
                border-width: 1px;
                border-style: solid;
                display: inline-block;
                background-color: white;
                position: relative;
            }
        `
    ],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: SwitcherComponent, multi: true}
    ],
})
export class SwitcherComponent implements ControlValueAccessor {

    constructor(
        private _builder: AnimationBuilder
    ) {}

    @ViewChild("circle")
    public circle: ElementRef;

    @ViewChild("bar")
    public bar: ElementRef;

    public playerCircle: AnimationPlayer;
    public playerBar: AnimationPlayer;

    @Output()
    public change = new EventEmitter<boolean>();

    @Input()
    public height: number = 12;
    @Input()
    public width: number = 36;
    @Input()
    public duration: number = 300;
    public readonly defaultActiveColor: string = "#64bd63";
    public readonly defaultInactiveColor: string = "#a0c0a2";

    // The internal data model
    private _value: boolean = true;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // get accessor
    get value(): boolean {
        return this._value;
    }

    // set accessor including call the onchange callback
    set value(v: boolean) {
        if (v === this._value) {
            return;
        }

        /*if (this.playerCircle) {
            this.playerCircle.destroy();
        }

        if (this.playerBar) {
            this.playerBar.destroy();
        }*/

        const forTrueCircle: AnimationStyleMetadata = style({ left: this.getLeft(true) + "px", "border-color": this.defaultActiveColor });
        const forFalseCircle: AnimationStyleMetadata = style({ left: this.getLeft(false), "border-color": this.defaultInactiveColor });

        const factoryCircle: AnimationFactory = this._builder.build(
            this._value
                ? [forTrueCircle, animate(this.duration, forFalseCircle)]
                : [forFalseCircle, animate(this.duration, forTrueCircle)]
        );

        const playerCircle: AnimationPlayer = factoryCircle.create(this.circle.nativeElement, {});

        const forTrueBar: AnimationStyleMetadata = style({
            "background-color": this.defaultActiveColor,
            "border-color": this.defaultActiveColor
        });
        const forFalseBar: AnimationStyleMetadata = style({
            "background-color": this.defaultInactiveColor,
            "border-color": this.defaultInactiveColor
        });

        const factoryBar: AnimationFactory = this._builder.build(
            this._value
                ? [forTrueBar, animate(this.duration, forFalseBar)]
                : [forFalseBar, animate(this.duration, forTrueBar)]
        );

        const playerBar: AnimationPlayer = factoryBar.create(this.bar.nativeElement, {});

        playerCircle.onDone(() => playerCircle.destroy());
        playerCircle.play();

        playerBar.onDone(() => playerBar.destroy());
        playerBar.play();

        this._value = v;
        this.change.emit(this._value);
        this.onChangeCallback(v);
    }

    public click(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.value = !this.value;
    }

    public getLeft(enabled: boolean): number {
        return enabled ? this.width - this.height * 1.5 : 0;
    }

    public getColor(enabled: boolean): string {
        return enabled ? this.defaultActiveColor : this.defaultInactiveColor;
    }

    writeValue(value: boolean) {
        if (value !== this._value) {
            this._value = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
