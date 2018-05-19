import {DayCell, MonthKind} from "./calendar.component/calendar.component";

export class CalendarDaysProcessor {

    static readonly daysOfWeeks: string[] = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    private readonly DAYS_IN_MONTH: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    public getMonthLength(month: number, year: number) {
        let monthLength = this.DAYS_IN_MONTH[month];

        if (month === 1) { // только февраль
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                monthLength = 29;
            }
        }
        return monthLength;
    }

    public generateDays(date: Date): DayCell[][] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const mondayStartOffsetDay = (new Date(year, month, 1)).getDay();

        const monthLength = this.getMonthLength(month, year);

        let prevMonth = month;
        let prevYear = year;
        if (month - 1 < 0) {
            prevMonth = 12 - month - 1;
            prevYear--;
        } else {
            prevMonth = month - 1;
        }
        const prevMonthLength = this.getMonthLength(prevMonth, prevYear);

        let nextMonth = month;
        let nextYear = year;
        if (month + 1 > 11) {
            nextMonth = month - 12 + 1;
            nextYear++;
        } else {
            nextMonth = month + 1;
        }
        const nextMonthLength = this.getMonthLength(nextMonth, nextYear);

        let monthKind: MonthKind = "prev";

        let day = mondayStartOffsetDay !== 0 ? prevMonthLength - mondayStartOffsetDay + 1 : prevMonthLength - mondayStartOffsetDay + 1 - 7;

        const dateArr = [];
        let dateRow: DayCell[] = [];
        // по неделям строки
        for (let i = 0; i < 6; i++) {
            // днмям - ячейки
            dateRow = [];
            for (let j = 0; j <= 6; j++) {
                day++;

                switch (monthKind) {
                    case "prev":
                        if (day === prevMonthLength + 1) {
                            monthKind = "current";
                            day = 1;
                        }
                        break;
                    case "current":
                        if (day === monthLength + 1) {
                            monthKind = "next";
                            day = 1;
                        }
                        break;
                    case "next":
                        break;
                }

                switch (monthKind) {
                    case "prev":
                        if (day <= prevMonthLength) {
                            dateRow.push(<DayCell>{
                                dayNumber: day,
                                date: new Date(prevYear, prevMonth, day),
                                monthKind
                            });
                        }
                        break;
                    case "current":
                        if (day <= monthLength) {
                            dateRow.push(<DayCell>{
                                dayNumber: day,
                                date: new Date(year, month, day),
                                monthKind
                            });
                        }
                        break;
                    case "next":
                        dateRow.push(<DayCell>{
                            dayNumber: day,
                            date: new Date(nextYear, nextMonth, day),
                            monthKind
                        });
                        break;
                }
            }
            dateArr.push(dateRow);
        }
        return dateArr;
    }
}
