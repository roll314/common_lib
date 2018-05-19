import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {animate, AnimationBuilder, AnimationPlayer, style} from '@angular/animations';
import {AnimationFactory} from '@angular/animations/src/animation_builder';


export class PhotoData {
    public opened: boolean = false;
    constructor (
        public id: number,
        public miniatureUrl: string = '',
        public url: string = ''
    ) {}
}

@Component({
    selector: 'gallery-image',
    template: `
        <div>
            <img
                #miniatureImage
                [style.width.px]="miniatureWidth"
                class="image"
                [src]="photoData.miniatureUrl"
                (click)="openClose($event)"/>
            <div class="opened-backdrop" #backdrop style="display: none;" (click)="openClose($event)">
                <img
                    #fullImage
                    [style.width.px]="miniatureWidth"
                    class="full-image"
                    [src]="photoData.url"
                    (click)="openClose($event)"/>
            </div>
        </div>
    `,
    styles: [
        `
            .image {
                cursor: zoom-in;
            }

            .full-image {
                z-index: 10;
                position: fixed;
                cursor: zoom-out;
                opacity: 0.5;
            }

            .opened-backdrop {
                position: fixed;
                cursor: default;
                z-index: 10;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        `
    ]
})
export class GalleryImageComponent {

    @Input()
    public photoData: PhotoData;

    @Input()
    public miniatureWidth: number = 100;

    @Input()
    public fullWidth: number = 700;

    @Input()
    public topOffset: string = '10%';

    @Input()
    public duration: number = 300;

    constructor(
        private _builder: AnimationBuilder
    ) {}

    @ViewChild('miniatureImage')
    public miniatureImage: ElementRef;

    @ViewChild('fullImage')
    public fullImage: ElementRef;

    @ViewChild('backdrop')
    public backdrop: ElementRef;

    public openClose(e: Event) {
        e.stopPropagation();
        this.photoData.opened = !this.photoData.opened;
        this.animate();
    }

    public animate() {
        const left: number = this.miniatureImage.nativeElement.getBoundingClientRect().left;
        const top: number = this.miniatureImage.nativeElement.getBoundingClientRect().top;

        if (this.photoData.opened) {
            this.fullImage.nativeElement.style.left = `${left}px`;
            this.fullImage.nativeElement.style.top = `${top}px`;
        }

        const backDropFactory: AnimationFactory = this._builder.build(
            this.photoData.opened
                ? animate(this.duration, style({ 'background-color': 'rgba(0, 0, 0, 0.75)' }))
                : animate(this.duration, style({ 'background-color': 'rgba(0, 0, 0, 0)' }))
        );
        const backDropPlayer: AnimationPlayer = backDropFactory.create(this.backdrop.nativeElement, {});

        const factory: AnimationFactory = this._builder.build(
            this.photoData.opened
                ? animate(this.duration, style({
                        width: `${this.fullWidth}px`,
                        left: '50%',
                        top: this.topOffset,
                        transform: 'translate(-50%)',
                        opacity: 1
                    }))
                : animate(this.duration, style({
                    width: `${this.miniatureWidth}px`,
                    left: left,
                    top: top,
                    transform: 'translate(0%)',
                    opacity: 0.5
                }))
        );

        const player: AnimationPlayer = factory.create(this.fullImage.nativeElement, {});
        player.onDone(() => this.backdrop.nativeElement.style.display = this.photoData.opened ? 'block' : 'none' );
        player.onStart(() => this.backdrop.nativeElement.style.display = 'block' );

        backDropPlayer.play();
        player.play();
    }
}
