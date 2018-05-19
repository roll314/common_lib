import {AbstractHeaderComponent} from "./AbstractHeaderComponent";
import {AbstractCellComponent} from "./AbstractCellComponent";

export type DataGetterType<TData, TCellData> = (TData) => TCellData;

export class GridSchemaItem<TData, TCellData> {
    constructor(
        public headerComponent:  new (...args: any[]) => AbstractHeaderComponent,
        public header: string,
        public cellComponent:  new (...args: any[]) => AbstractCellComponent<TData, TCellData>,
        public style: { [name: string]: string },
        public cellDataGetter: DataGetterType<TData, TCellData>
    ) {}
}
