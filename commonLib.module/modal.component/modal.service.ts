import {
    ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector} from "@angular/core";
import {IModalSettings, ModalComponent} from "./modal.component";

export abstract class AbstractModalComponent<TData, TResult> {

    abstract data: TData;

    public close: (result: TResult) => void;
}

@Injectable()
export class ModalService {

    public resultBeforeAnimation: boolean = true;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {}

    public async showModal<TResult, TData, TComponent extends AbstractModalComponent<TData, TResult>>
        (component: new (...args: any[]) => TComponent, data: TData, settings: IModalSettings = null): Promise<TResult> {

        const modalComponentRef = this.componentFactoryResolver
            .resolveComponentFactory<ModalComponent>(ModalComponent)
            .create(this.injector);

        if (settings) {
            modalComponentRef.instance.settings = settings;
        }

        this.appRef.attachView(modalComponentRef.hostView);
        const modalDomElem = (modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        document.body.appendChild(modalDomElem);

        const componentFactory = this.componentFactoryResolver
            .resolveComponentFactory<AbstractModalComponent<TData, TResult>>(component);
        const componentRef = modalComponentRef.instance.modalContent.createComponent(componentFactory);
        componentRef.instance.data = data;

        return new Promise<TResult>((resolve => {
            componentRef.instance.close = (result: TResult) => {
                if (this.resultBeforeAnimation) {
                    resolve(result);
                }
                modalComponentRef.instance.close(() => {
                    componentRef.destroy();
                    modalComponentRef.destroy();
                    if (!this.resultBeforeAnimation) {
                        resolve(result);
                    }
                    // modalComponentRef.instance.modalContent.detach(0);
                    // this.appRef.detachView(modalComponentRef.hostView);
                });
            }
        }));
    }
}
