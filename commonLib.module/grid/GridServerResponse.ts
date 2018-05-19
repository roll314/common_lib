export class GridServerResponse<T> {
    constructor(
        public data: T[],
        public totalRows: number
    ) {}
}
