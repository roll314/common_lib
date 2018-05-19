import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {DatePickerComponent} from "../datePicker.component/datePicker.component";
import {
    DateRange, DateRangePickerComponent,
    PresetDateRange
} from "../dateRangePicker.component/dateRangePicker.component";
import {
    getDefaultDateRangePickerSettings,
    IDateRangePickerSettings
} from "../dateRangePicker.component/IDateRangePickerSettings";

export const DROPDOWN_DATE_RANGE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownDateRangePickerComponent),
    multi: true
};

export type DropdownDateRangePickerDateFormatterType = (range: DateRange) => string;

@Component({
    selector: "dropdown-date-range-picker",
    templateUrl: "./dropdownDateRangePicker.component.html",
    styleUrls: ["./dropdownDateRangePicker.component.css"],
    providers: [DROPDOWN_DATE_RANGE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DropdownDateRangePickerComponent extends DateRangePickerComponent {
    public closed: boolean = false;

    public dateRange: DateRange;
    public notAppliedDateRange: DateRange;

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

    @Input()
    public width: string = "170px";

    @Input()
    public positionFixed: boolean = true;

    public apply() {
        this.closed = true;
        if (!this.notAppliedDateRange || !this.notAppliedDateRange.start || !this.notAppliedDateRange.end) {
            return;
        }
        this.dateRange = this.notAppliedDateRange;
        this.onChangeCallback(this.dateRange);
        this.onApplyButtonClicked.emit();
    }

    public close() {
        this.closed = true;
        this.onCloseButtonClicked.emit();
    }

    public writeValue(value: any) {
        if (value !== undefined && value !== null) {
            this.dateArr = [value.start, value.end];
            this.viewDate = new Date(value.end) || new Date(value.start) || new Date();
            this.dateRange = this.toDateRange(this.dateArr);
        } else {
            this.dateArr = [];
        }
    }

    public dateRangeChanged(dateRange: DateRange) {
        this.notAppliedDateRange = dateRange;

        this.onDateRangeChanged.emit(dateRange);
    }
}
