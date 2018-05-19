import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
import {getDefaultDatePickerSettings, IDatePickerSettings} from "./IDatePickerSettings";
import {AddFunctionType} from "../calendar.component/calendar.component";

export const DATE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
};

type DatePickerViewType = "day" | "month" | "year";

@Component({
    selector: "date-picker",
    templateUrl: "./datePicker.component.html",
    styleUrls: ["./datePicker.component.css"],
    providers: [DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
    public currentView: DatePickerViewType = "day";

    @Input()
    public settings: IDatePickerSettings = getDefaultDatePickerSettings();

    @Input()
    public multiselect: boolean = false;

    @Output()
    public onDateChanged: EventEmitter<Date | Date[]> = new EventEmitter<Date | Date[]>();

    public date: Date | Date[] = this.multiselect ? [] : new Date();
    public viewDate: Date = new Date();

    protected onTouchedCallback: () => {};
    protected onChangeCallback: (_: any) => {};

    public addFunction: AddFunctionType = (date: Date, dates: Date[] | Date) => Array.isArray(dates) ? [date] : date;

    ngOnInit(): void {
        this.date = this.multiselect ? [] : new Date();

        this.addFunction = this.multiselect
            ? (date: Date, dates: Date[]) => {
                const index = dates.indexOf(date);
                if (index !== -1) {
                    dates.splice(index, 1);
                } else {
                    dates.push(date);
                }

                return dates;
            }
            : (date: Date, dates: Date[] | Date) => Array.isArray(dates) ? [date] : date;
    }

    public get monthName(): string {
        return this.settings.monthNames[this.viewDate.getMonth()];
    }

    public setView(view: DatePickerViewType) {
        this.currentView = view;
    }

    public setToday() {
        this.date = new Date();
        this.viewDate = new Date();
    }

    public setMonth(month: number) {
        this.viewDate.setMonth(month);
        this.currentView = "day";
    }

    public setYear(year: number) {
        this.viewDate.setFullYear(year);
        this.currentView = "day";
    }

    public prevMonth() {
        const month: number = this.viewDate.getMonth() === 0 ? 11 : this.viewDate.getMonth() - 1;
        this.viewDate = new Date(this.viewDate.setMonth(month));
    }

    public nextMonth() {
        const month: number = this.viewDate.getMonth() === 11 ? 0 : this.viewDate.getMonth() + 1;
        this.viewDate = new Date(this.viewDate.setMonth(month));
    }

    public prevYear() {
        this.viewDate = new Date(this.viewDate.setFullYear(this.viewDate.getFullYear() - 1));
    }

    public nextYear() {
        this.viewDate = new Date(this.viewDate.setFullYear(this.viewDate.getFullYear() + 1));
    }

    public onCalendarDateChange(date: Date) {
        this.onDateChanged.emit(date);
        this.onChangeCallback(date);
    }

    public writeValue(value: Date | Date[]) {
        if (value !== undefined && value !== null) {
            this.date = value;
            this.viewDate = Array.isArray(value) ? new Date() : value;
        } else {
            this.date = this.multiselect ? [] : new Date();
        }
    }

    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}
