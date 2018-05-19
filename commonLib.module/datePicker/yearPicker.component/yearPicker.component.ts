import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Output} from "@angular/core";

export const YEAR_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => YearPickerComponent),
    multi: true
};

@Component({
    selector: "year-picker",
    templateUrl: "./yearPicker.component.html",
    styleUrls: ["./yearPicker.component.css"],
    providers: [YEAR_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class YearPickerComponent implements ControlValueAccessor {

    public currentYear: number = (new Date()).getFullYear();
    public year: number = (new Date()).getFullYear();
    public viewYear: number = (new Date()).getFullYear();

    @Output()
    public onYearChanged: EventEmitter<number> = new EventEmitter<number>();

    private onTouchedCallback: () => {};
    private onChangeCallback: (_: any) => {};

    public setYear(year: number) {
        this.year = year;
        this.onYearChanged.emit(year);
        this.onChangeCallback(year);
    }

    public writeValue(value: number) {
        if (value !== undefined && value !== null) {
            this.year = value;
        } else {
            this.year = (new Date()).getFullYear();
        }
    }

    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
