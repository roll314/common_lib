import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {GridDataRow, GridSchema} from "../GridSchema";
import {GridSettings} from "../GridSettings";
import {GridServerResponse} from "../GridServerResponse";
import {GridServerRequest} from "../GridServerRequest";

export class RowSelectionInfo<T> {
    constructor(
        public row: GridDataRow<T>,
        public selected: boolean,
        public rows: GridDataRow<T>[]
    ) {}
}

@Component({
    selector: "ng-grid",
    templateUrl: "./grid.component.html",
    styleUrls: [
        "./../../../commonStyles/checkboxes.css",
        "./../../../commonStyles/dataTables.css",
        "./../../../commonStyles/loadSpinner.css",
        "./grid.component.css"
    ]
})
export class GridComponent implements OnInit {

    public isLoading: boolean = false;

    public myself: GridComponent = this;

    @Input()
    public schema: GridSchema<any>;

    @Input()
    public settings: GridSettings = new GridSettings();

    @Output()
    public onRowClick: EventEmitter<GridDataRow<any>> = new EventEmitter<GridDataRow<any>>();

    @Output()
    public onRowSelected: EventEmitter<RowSelectionInfo<any>> = new EventEmitter<RowSelectionInfo<any>>();

    @Output()
    public onDataUpdateStarted: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public onDataUpdateFinished: EventEmitter<void> = new EventEmitter<void>();

    public totalRows: number;

    public pageChanged(page: number) {
        this.settings.currentPage = page;
        this.updateData();
    }

    public updateData() {
        this.onDataUpdateStarted.emit();
        this.isLoading = true;
        this.schema.dataSource(
                new GridServerRequest(
                    this.settings.currentPage,
                    this.settings.rowsPerPage
                )
            )
            .then((response: GridServerResponse<any>) => {
                this.schema.dataRows = GridDataRow.init(response.data);
                this.totalRows = response.totalRows;
                this.isLoading = false;
                /* todo грязный хак */
                setTimeout(() => this.onDataUpdateFinished.emit(), 1);
            });
    }

    public selectRow(e: Event, dataRow: GridDataRow<any>) {
        e.stopPropagation();
        dataRow.selected = !dataRow.selected;
        this.onRowSelected.emit(new RowSelectionInfo<any>(dataRow, dataRow.selected, this.schema.dataRows));
    }

    ngOnInit(): void {
        this.updateData();
    }

    public rowClick(rowData: GridDataRow<any>) {
        this.onRowClick.emit(rowData);
    }
}
