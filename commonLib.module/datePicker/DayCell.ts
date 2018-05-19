export type MonthKind = "prev" | "current" | "next";

export class DayCell {
    public dayNumber: number;
    public date: Date;
    public monthKind: MonthKind;
}
