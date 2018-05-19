export type GetItemId<T> = (item: T) => string | number;
export type GetShownName<T> = (item: T) => string;
export type FilterFn<T> = (item: T, filter: string) => boolean;

export interface DropdownSettings<T> {
    singleSelection: Boolean;
    text: String;
    enableCheckAll: Boolean;
    selectAllText: String;
    unSelectAllText: String;
    enableSearchFilter: Boolean;
    maxHeight: number;
    badgeShowLimit: Number;
    classes: String;
    limitSelection?: Number;
    disabled?: Boolean;
    searchPlaceholderText: String;
    groupBy?: String;
    showCheckbox?: Boolean;
    noDataLabel: string;
    filterEnterInvitation: string;
    searchAutofocus?: boolean;
    lazyLoading?: boolean;
    serverSearchDelay?: number;
    getItemId: GetItemId<T>;
    getShownName: GetShownName<T>;
    filterFn: FilterFn<T>;
}
