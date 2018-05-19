import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const PAGINATION_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PaginationComponent),
    multi: true
};

@Component({
    selector: "ng-paginaton",
    template: `
        <a
                class="paginate_button previous"
                [ngClass]="{'disabled': currentPage == 1}"
                (click)="previousPage()">
            Предыдущая
        </a>
        <span>
            <a
                    class="paginate_button"
                    *ngIf="currentPage > paginationOffset + 1"
                    (click)="setPage(1)">
                1
            </a>
            <span *ngIf="currentPage > paginationOffset + 2">...</span>

            <ng-container *ngFor="let page of paginationOffsetArrNegative">
                <a
                        class="paginate_button"
                        (click)="setPage(currentPage + page)"
                        *ngIf="isPageAllowed(page)">
                    {{currentPage + page}}
                </a>
            </ng-container>

            <a class="paginate_button current">{{currentPage}}</a>

            <ng-container *ngFor="let page of paginationOffsetArrPositive">
                <a
                        class="paginate_button"
                        (click)="setPage(currentPage + page)"
                        *ngIf="isPageAllowed(page)">
                    {{currentPage + page}}
                </a>
            </ng-container>

            <span *ngIf="currentPage < maxPagesCount - paginationOffset - 1">...</span>
            <a
                    class="paginate_button"
                    *ngIf="currentPage < maxPagesCount - paginationOffset"
                    (click)="setPage(maxPagesCount)">
                {{maxPagesCount}}
            </a>
        </span>
        <a
                class="paginate_button next"
                [ngClass]="{'disabled': currentPage == maxPagesCount}"
                (click)="nextPage()">
            Следующая
        </a>
    `,
    styleUrls: ["../../../commonStyles/checkboxes.css"],
    providers: [PAGINATION_CONTROL_VALUE_ACCESSOR]
})
export class PaginationComponent implements ControlValueAccessor {

    public currentPage: number = 1;

    @Input()
    public totalRows: number;

    @Input()
    public rowsPerPage: number = 30;

    @Input()
    public paginationOffset: number = 2;

    @Output()
    public onPageChanged: EventEmitter<number> = new EventEmitter<number>();

    public paginationOffsetArrNegative: number[] = [];
    public paginationOffsetArrPositive: number[] = [];

    protected onTouchedCallback: () => {};
    protected onChangeCallback: (_: any) => {};

    constructor() {
        for (let i = 1; i <= this.paginationOffset; i++) {
            this.paginationOffsetArrPositive.push(i);
        }

        for (let i = -this.paginationOffset; i < 0; i++) {
            this.paginationOffsetArrNegative.push(i);
        }
    }

    public get maxPagesCount(): number {
        return Math.ceil(this.totalRows / this.rowsPerPage);
    }

    public isPageAllowed(page: number) {
        return page + this.currentPage <= this.maxPagesCount &&
            this.currentPage + page  >= 1;
    }

    public nextPage() {
        if (this.currentPage >= this.maxPagesCount) {
            return;
        }

        this.currentPage++;

        this.onPageChanged.emit(this.currentPage);
    }

    public previousPage() {
        if (this.currentPage <= 1) {
            return;
        }

        this.currentPage--;

        this.onPageChanged.emit(this.currentPage);
    }

    public setPage(page: number) {
        this.currentPage = page;
        this.onPageChanged.emit(this.currentPage);
    }

    public writeValue(value: number) {
        if (value !== undefined && value !== null) {
            this.currentPage = value;
        } else {
            this.currentPage = 1;
        }
    }

    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
