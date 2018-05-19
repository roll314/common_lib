export class GridSettings {
    constructor(
        public currentPage: number = 1,
        public rowsPerPage: number = 30,
        public paginationOffset: number = 2,
        public selectableRows: boolean = true,
        public hidePaginatorIfNoPages: boolean = false,
        public noRecordsTitle: string = "Нет записей"
    ) {}
}
