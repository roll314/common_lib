import {SortOrder} from "./SortOrder";
import {DataGetterType} from "./GridSchemaItem";
import {AbstractDynamicComponent} from "../dinamic.component/dynamic.component";

export abstract class AbstractHeaderComponent extends AbstractDynamicComponent {
    public order: SortOrder = SortOrder.Restricted;
    public header: string = "";
}
