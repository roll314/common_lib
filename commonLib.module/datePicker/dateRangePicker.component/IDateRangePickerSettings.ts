import {getDefaultDatePickerSettings, IDatePickerSettings} from "../datePicker.component/IDatePickerSettings";
import {DropdownDateRangePickerDateFormatterType} from "../dropdownDateRangePicker.component/dropdownDateRangePicker.component";
import {DateRange} from "./dateRangePicker.component";

export type DropdownDatePickerDateParseType = (string) => Date;

export interface IDateRangePickerSettings extends IDatePickerSettings {
    parseDate: DropdownDatePickerDateParseType;
    applyButtonText: string;
    closeButtonText: string;
    dateRangeFormatter: DropdownDateRangePickerDateFormatterType;
}

export function getDefaultDateRangePickerSettings() {
    const res: IDateRangePickerSettings = <IDateRangePickerSettings> getDefaultDatePickerSettings();
    res.dateRangeFormatter = (dateRange: DateRange) => {
        if (!dateRange || !dateRange.start || !dateRange.end) {
            return "Ничего не выбрано";
        }
        return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
    };
    res.applyButtonText = "Применить";
    res.closeButtonText = "Закрыть";
    res.parseDate = (str: string) => {
        const arr: string[] = str.split(".");
        const date: Date = new Date(
            parseInt(arr[2], 10),
            parseInt(arr[1], 10) - 1,
            parseInt(arr[0], 10)
        );

        return isNaN(date.getTime()) ? null : date;
    };
    return res;
}
