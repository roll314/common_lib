import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
import {DatePickerComponent} from "../datePicker.component/datePicker.component";
import {getDefaultDateRangePickerSettings, IDateRangePickerSettings} from "./IDateRangePickerSettings";

export const DATE_RANGE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateRangePickerComponent),
    multi: true
};

export class DateRange {
    constructor(
        public start: Date,
        public end: Date
    ) {}
}

export class PresetDateRange {
    constructor(
       public title: string,
       public start: Date,
       public end: Date
    ) {}
}

@Component({
    selector: "date-range-picker",
    templateUrl: "./dateRangePicker.component.html",
    styleUrls: ["../datePicker.component/datePicker.component.css", "./dateRangePicker.component.css"],
    providers: [DATE_RANGE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DateRangePickerComponent extends DatePickerComponent implements OnInit {
    public dateArr: Date[] = [new Date(), new Date()];

    @Input()
    public settings: IDateRangePickerSettings = getDefaultDateRangePickerSettings();

    @Input()
    public presetDateRanges: PresetDateRange[] = this.getDefaultPresetDateRanges();

    @Output()
    public onDateRangeChanged: EventEmitter<DateRange> = new EventEmitter<DateRange>();

    @Output()
    public onCloseButtonClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public onApplyButtonClicked: EventEmitter<any> = new EventEmitter<any>();

    public highlightDays = [(date: Date, dates: Date[]) => {
        dates = dates || [];
        if (dates.length !== 2 || !dates[0] || !dates[1]) {
            return false;
        }

        const minDateMs: number = Math.min(dates[0].getTime(), dates[1].getTime());
        const maxDateMs: number = Math.max(dates[0].getTime(), dates[1].getTime());

        return date.getTime() > minDateMs && date.getTime() < maxDateMs;
    }];

    public addFunction = (date: Date, dates: Date[]) => {
        dates = dates || [];
        if (dates.length === 0 || dates.length === 1) {
            dates.push(date);
            return dates;
        }

        if (dates.length === 2) {
            dates = [date];
            return dates;
        }
    };

    constructor() {
        super();
        this.multiselect = true;
    }

    ngOnInit(): void {
        this.multiselect = true;
        this.date = [];
        this.addFunction = (date: Date, dates: Date[]) => {
            dates = dates || [];
            if (dates.length === 0 || dates.length === 1) {
                dates.push(date);
                return dates;
            }

            if (dates.length === 2) {
                dates = [date];
                return dates;
            }
        };
    }

    protected getDefaultPresetDateRanges(): PresetDateRange[] {
        const now: Date = new Date();
        const yesterday: Date = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek: Date = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth: Date = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);

        return [
            new PresetDateRange("Сегодня", now, now),
            new PresetDateRange("Вчера", yesterday, yesterday),
            new PresetDateRange("Пред. 7 дней", lastWeek, now),
            new PresetDateRange("Пред. 30 дней", lastMonth, now)
        ];
    }

    public setDate(index: number, value: string) {
        const date: Date = this.settings.parseDate(value);
        if (!date) {
            return;
        }
        this.dateArr[index] = date;
        this.onCalendarDateRangeChange(this.dateArr);
    }

    protected toDateRange(dateArr: Date[]): DateRange {
        return new DateRange(
            new Date(Math.min.apply(null, dateArr.map(d => d.getTime()))),
            new Date(Math.max.apply(null, dateArr.map(d => d.getTime())))
        );
    }

    public apply() {
        if (!this.dateArr || !this.dateArr[0] || !this.dateArr[1]) {
            return;
        }

        this.onChangeCallback(this.toDateRange(this.dateArr));
        this.onApplyButtonClicked.emit();
    }

    public close() {
        this.onCloseButtonClicked.emit();
    }

    public setRange(start: Date, end: Date) {
        this.onCalendarDateRangeChange([start, end]);
        this.viewDate = new Date(end) || new Date(start) || new Date();
    }

    public setToday() {
        this.viewDate = new Date();
    }

    public onCalendarDateRangeChange(date: Date[]) {
        this.dateArr = date;
        if (this.dateArr[0] && this.dateArr[1]) {
            this.onDateRangeChanged.emit(new DateRange(date[0], date[1]));
        }
    }

    public writeValue(value: any) {
        if (value !== undefined && value !== null) {
            this.dateArr = [value.start, value.end];
            this.viewDate = new Date(value.end) || new Date(value.start) || new Date();
        } else {
            this.dateArr = [];
        }
    }
}
