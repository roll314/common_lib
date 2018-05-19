import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";

export const MONTH_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonthPickerComponent),
    multi: true
};

@Component({
    selector: "month-picker",
    templateUrl: "./monthPicker.component.html",
    styleUrls: ["./monthPicker.component.css"],
    providers: [MONTH_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class MonthPickerComponent implements ControlValueAccessor {

    public month: number = (new Date()).getMonth();

    @Input()
    public months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    @Output()
    public onMonthChanged: EventEmitter<number> = new EventEmitter<number>();

    private onTouchedCallback: () => {};
    private onChangeCallback: (_: any) => {};

    public setMonth(month: number) {
        this.month = month;
        this.onMonthChanged.emit(month);
        this.onChangeCallback(month);
    }

    public writeValue(value: number) {
        if (value !== undefined && value !== null) {
            this.month = value;
        } else {
            this.month = (new Date()).getMonth();
        }
    }

    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
