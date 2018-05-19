import {DisabledDateCallbackType} from "../calendar.component/calendar.component";
import {DropdownDatePickerDateFormatterType} from "../dropdownDatePicker.component/dropdownDatePicker.component";

export interface IDatePickerSettings {
    monthNames: string[];
    shortMonthNames: string[];
    disabledDays: (Date | DisabledDateCallbackType)[];
    daysOfWeeks: string[];
    dateFormatter: DropdownDatePickerDateFormatterType;
}

export function getDefaultDatePickerSettings(): IDatePickerSettings {
    return <IDatePickerSettings> {
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        shortMonthNames: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
            "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        disabledDays: [],
        daysOfWeeks: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
        dateFormatter: (date: Date) => date ? date.toLocaleDateString() : ""
    };
}
