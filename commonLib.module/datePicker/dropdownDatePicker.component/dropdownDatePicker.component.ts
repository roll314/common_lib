import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {DatePickerComponent} from "../datePicker.component/datePicker.component";

export const DROPDOWN_DATE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownDatePickerComponent),
    multi: true
};

export type DropdownDatePickerDateFormatterType = (date: Date) => string;

@Component({
    selector: "dropdown-date-picker",
    templateUrl: "./dropdownDatePicker.component.html",
    styleUrls: ["./dropdownDatePicker.component.css"],
    providers: [DROPDOWN_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DropdownDatePickerComponent extends DatePickerComponent implements OnInit {

    public closed: boolean = true;

    @Input()
    public width: string = "150px";

    @Input()
    public positionFixed: boolean = true;

    @Input()
    public multiselect: boolean = false;

    @Input()
    public showRemoveCross: boolean = true;

    @Input()
    public disabled: boolean = false;

    @Input()
    public dateFormatter: DropdownDatePickerDateFormatterType = (date: Date) => date.toLocaleDateString();

    ngOnInit(): void {
        this.date = this.multiselect ? [] : new Date();
    }

    public dateChanged(date: Date | Date[]) {
        this.onDateChanged.emit(date);
        this.onChangeCallback(date);
    }

    public removeDate(event: Event, date: Date) {
        event.stopPropagation();

        if (!this.multiselect) {
            return;
        }

        const index = (<Date[]> this.date).indexOf(date);

        if (index === -1) {
            return;
        }

        (<Date[]> this.date).splice(index, 1);

        this.dateChanged(this.date);
    }
}
