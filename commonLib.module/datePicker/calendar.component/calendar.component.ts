import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
import {CalendarDaysProcessor} from "../CalendarDaysProcessor";

export const CALENDAR_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CalendarComponent),
    multi: true
};

export type MonthKind = "prev" | "current" | "next";

export class DayCell {
    public dayNumber: number;
    public date: Date;
    public monthKind: MonthKind;
}

export type DisabledDateCallbackType = (Date) => boolean;
export type HighlightCallbackType = (date: Date, dates: Date[] | Date) => boolean;

export type AddFunctionType = (date: Date, dates: Date[] | Date) => Date | Date[];

@Component({
    selector: "ng-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    providers: [CALENDAR_CONTROL_VALUE_ACCESSOR]
})

export class CalendarComponent implements ControlValueAccessor {

    private readonly DAYS_IN_MONTH: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    protected _calendarDaysProcessor: CalendarDaysProcessor = new CalendarDaysProcessor();

    @Input()
    public disabledDays: (Date | DisabledDateCallbackType)[] = [];

    public date: Date[] | Date = new Date();

    public _viewDate: Date = new Date();

    @Input()
    public set viewDate(value: Date) {
        this._viewDate = value;
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
    }

    public get viewDate(): Date {
        return this._viewDate;
    }

    @Input()
    public daysOfWeeks: string[] = CalendarDaysProcessor.daysOfWeeks;

    @Output()
    public onDateChange: EventEmitter<Date[] | Date> = new EventEmitter<Date[] | Date>();

    public monthDays: DayCell[][] = [];

    private onTouchedCallback: () => {};
    private onChangeCallback: (_: any) => {};

    @Input()
    public highlightDays: (Date | HighlightCallbackType)[] = [];

    @Input()
    public addFunction: AddFunctionType = (date: Date, dates: Date[] | Date) => Array.isArray(dates) ? [date] : date;

    writeValue(value: Date[] | Date) {
        if (value !== undefined && value !== null) {
            this.date = value;
            this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
        } else {
            this.date = new Date();
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDay(day: DayCell) {
        if (this.isDayDisabled(day)) {
            return;
        }
        this.date = this.addFunction(day.date, this.date);
        this.onDateChange.emit(this.date);
        this.onChangeCallback(this.date);
    }

    isDayDisabled(day: DayCell): boolean {
        return !!this.disabledDays.find((dd: Date | DisabledDateCallbackType) => {
            if (typeof dd === "function") {
                return dd(day.date);
            } else {
                return day.date.toLocaleDateString() === dd.toLocaleDateString();
            }
        });
    }

    isHighlightedDay(day: DayCell): boolean {
        return !!this.highlightDays.find((dd: Date | HighlightCallbackType) => {
            if (typeof dd === "function") {
                return dd(day.date, this.date);
            } else {
                return day.date.toLocaleDateString() === dd.toLocaleDateString();
            }
        });
    }

    isSelectedDay(day: DayCell): boolean {
        if (Array.isArray(this.date)) {
            if (!this.date || this.date.length === 0) {
                return false;
            }

            return !!this.date.find((dd: Date) => {
                return dd && day.date.getFullYear() === dd.getFullYear() &&
                    day.date.getMonth() === dd.getMonth() &&
                    day.date.getDate() === dd.getDate();
            });
        } else {
            if (!this.date) {
                return false;
            }
            return day.date.getFullYear() === this.date.getFullYear() &&
                day.date.getMonth() === this.date.getMonth() &&
                day.date.getDate() === this.date.getDate();
        }
    }

    private _getMonthLength(month: number, year: number) {
        let monthLength = this.DAYS_IN_MONTH[month];

        // compensate for leap year
        if (month === 1) { // February only!
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                monthLength = 29;
            }
        }
        return monthLength;
    }
}
