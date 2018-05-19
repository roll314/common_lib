import {AbstractDynamicComponent} from "../dinamic.component/dynamic.component";
import {GridComponent} from "./grid.component/grid.component";
import {NgBlockUI} from "ng-block-ui";

export abstract class AbstractCellComponent<TData, TCellData> extends AbstractDynamicComponent {
    public data: TData;
    public cellData: TCellData;
    public grid: GridComponent;
}
