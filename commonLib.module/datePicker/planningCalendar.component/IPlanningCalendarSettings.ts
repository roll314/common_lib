export interface IPlanningCalendarSettings {
    monthNames: string[];
}

export function getDefaultPlanningCalendarSettings(): IPlanningCalendarSettings {
    return <IPlanningCalendarSettings> {
        monthNames:  ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    };
}
