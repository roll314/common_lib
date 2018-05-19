import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from "@angular/core";
import {AbstractDynamicComponent} from "./dynamic.component";
import {ComponentFactory} from "@angular/core/src/linker/component_factory";

@Injectable()
export class DynamicComponentCreationService {

    private rootViewContainer: ViewContainerRef;

    constructor(
        private factoryResolver: ComponentFactoryResolver
    ) {
    }

    setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.rootViewContainer = viewContainerRef;
    }

    addDynamicComponent(componentType: new() => AbstractDynamicComponent, inputData: { [name: string]: any }) {
        const factory: ComponentFactory<AbstractDynamicComponent> = this.factoryResolver.resolveComponentFactory(componentType);
        const component: ComponentRef<AbstractDynamicComponent> = factory.create(this.rootViewContainer.parentInjector);

        for (const name in inputData) {
            if (!inputData.hasOwnProperty(name)) {
                continue;
            }
            component.instance[name] = inputData[name];
        }

        this.rootViewContainer.insert(component.hostView);
    }
}
