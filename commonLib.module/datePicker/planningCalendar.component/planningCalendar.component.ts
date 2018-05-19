import {ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {CalendarComponent} from "../calendar.component/calendar.component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {DayCell} from "../DayCell";
import {getDefaultPlanningCalendarSettings, IPlanningCalendarSettings} from "./IPlanningCalendarSettings";
import {PlanningCheckList} from "../../../model/PlanningCheckList";
import {User} from "../../../model/User";
import {Branch} from "../../../model/Branch";
import {Location} from "../../../model/Location";
import {CheckListType} from "../../../model/CheckListType";
import {Shop} from "../../../model/Shop";

export const PLANNING_CALENDAR_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PlanningCalendarComponent),
    multi: true
};

export class PlanningCalendarTask<T> {
    constructor (
        public color: string,
        public title: string,
        public date: Date,
        public taskData: T = null
    ) {}
}

export class PlanningCalendarGroup<T> {
    public title: string;
    public count: number;
    public color: string;
    public date: Date;
    constructor(
       public tasks: PlanningCalendarTask<T>[]
    ) {}
}

@Component({
    selector: "planning-calendar",
    templateUrl: "./planningCalendar.component.html",
    styleUrls: ["./../calendar.component/calendar.component.css", "./planningCalendar.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningCalendarComponent extends CalendarComponent {

    public selectedTask: PlanningCalendarTask<any>;
    public selectedGroup: PlanningCalendarGroup<any>;

    public groupsDays: { [name: string]: PlanningCalendarGroup<any>[] } = {};
    public tasksDays: { [name: string]: PlanningCalendarTask<any>[] } = {};

    @Input()
    public set viewDate(value: Date) {
        if (this._viewDate && value && this._viewDate.getTime() === value.getTime()) {
            return;
        }
        this._viewDate = value;
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
    }

    public get viewDate(): Date {
        return this._viewDate;
    }

    @Input()
    public settings: IPlanningCalendarSettings = getDefaultPlanningCalendarSettings();

    public _tasks: PlanningCalendarTask<any>[] = [];
    @Input()
    public set tasks(data: PlanningCalendarTask<any>[]) {
        this._tasks = data;

        this.groupsDays = {};
        this.tasksDays = {};

        for (const days of this.monthDays) {
            for (const day of days) {
                this.groupsDays[day.date.toLocaleDateString()] = this.getGroupsByDate(day.date);
                this.tasksDays[day.date.toLocaleDateString()] = this.getNotGroupedTasksByDate(day.date);
            }
        }
    }

    public get tasks(): PlanningCalendarTask<any>[] {
        return this._tasks;
    }

    @Input()
    public groupCount: number = 3;

    @Input()
    public getTitle: (tasks: PlanningCalendarTask<any>[]) => string = tasks => tasks.map(tt => tt.title).join(", ");

    @Output()
    public onTaskAddClick: EventEmitter<DayCell>  = new EventEmitter<DayCell>();

    @Output()
    public onTaskClick: EventEmitter<PlanningCalendarTask<any>>  = new EventEmitter<PlanningCalendarTask<any>>();

    @Output()
    public onGroupClick: EventEmitter<PlanningCalendarGroup<any>>  = new EventEmitter<PlanningCalendarGroup<any>>();

    @Output()
    public onViewDateChange: EventEmitter<Date> = new EventEmitter<Date>();

    public get monthName(): string {
        return this.settings.monthNames[this.viewDate.getMonth()];
    }

    public getGroupsByDate(date: Date): PlanningCalendarGroup<any>[] {
        const tasks = this.tasks
            .filter(t => t.date.toLocaleDateString() === date.toLocaleDateString())
            .reduce((groups, item) => {
                if (this.tasks.filter(t => t.color === item.color &&
                        t.date.toLocaleDateString() === date.toLocaleDateString()).length < this.groupCount
                ) {
                    return groups;
                }
                const group: PlanningCalendarGroup<any> = groups.find(g => g.tasks[0].color === item.color);
                if (group) {
                    group.tasks.push(item);
                } else {
                    groups.push(new PlanningCalendarGroup([item]));
                }
                return groups;
            }, []);

        tasks.forEach(t => {
            t.title = this.getTitle(t.tasks);
            t.color = t.tasks[0].color;
            t.date =  t.tasks[0].date;
            t.count = t.tasks.length;
        });

        return tasks;
    }

    public getNotGroupedTasksByDate(date: Date): PlanningCalendarTask<any>[] {
        return this.tasks
            .filter(t => t.date.toLocaleDateString() === date.toLocaleDateString() &&
                this.tasks.filter(tt => tt.color === t.color && tt.date.toLocaleDateString() === date.toLocaleDateString()).length < this.groupCount);
    }

    public addTask(dayCell: DayCell) {
        this.onTaskAddClick.emit(dayCell);
    }

    public taskClick(task: PlanningCalendarTask<any>) {
        this.onTaskClick.emit(task);
        this.selectedTask = task;
        this.selectedGroup = null;
    }

    public groupClick(group: PlanningCalendarGroup<any>) {
        this.onGroupClick.emit(group);
        this.selectedTask = null;
        this.selectedGroup = group;
    }

    public prevMonth() {
        this._viewDate.setMonth(this._viewDate.getMonth() - 1);
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
        this.onViewDateChange.emit(this._viewDate);
    }

    public nextMonth() {
        this._viewDate.setMonth(this._viewDate.getMonth() + 1);
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
        this.onViewDateChange.emit(this._viewDate);
    }

    public prevYear() {
        this._viewDate.setFullYear(this._viewDate.getFullYear() - 1);
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
        this.onViewDateChange.emit(this._viewDate);
    }

    public nextYear() {
        this._viewDate.setFullYear(this._viewDate.getFullYear() + 1);
        this.monthDays = this._calendarDaysProcessor.generateDays(this._viewDate);
        this.onViewDateChange.emit(this._viewDate);
    }

    public setToday() {
        this._viewDate = new Date();
        this.onViewDateChange.emit(this._viewDate);
    }

    public compareObj(a, b): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }
}
