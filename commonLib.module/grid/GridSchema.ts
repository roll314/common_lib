import {GridSchemaItem} from "./GridSchemaItem";
import {GridServerResponse} from "./GridServerResponse";
import {GridServerRequest} from "./GridServerRequest";

export class GridDataRow<T> {
    constructor(
        public data: T,
        public selected: boolean = false
    ) {}

    public static init<T>(data: T[]) {
        return data.map((d: T) => new GridDataRow(d));
    }
}

export class GridSchema<T> {
    public dataRows: GridDataRow<T>[];

    constructor(
        public schemaRows: GridSchemaItem<T, any>[],
        public dataSource: (GridServerRequest) => Promise<GridServerResponse<T>>
    ) {}
}
