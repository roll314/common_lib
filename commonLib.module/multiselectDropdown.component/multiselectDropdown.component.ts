import {
    Component, OnInit, SimpleChanges, OnChanges, ContentChild, ViewChild, forwardRef,
    Input, Output, EventEmitter, ElementRef, DoCheck, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl} from "@angular/forms";
import {ListItem, MultiselectDropdownException} from "./model";
import {DropdownSettings} from "./DropdownSettings";
import {BubbleComponent, ItemComponent} from "./templateRenderer.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
};

export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true,
};

const noop = () => {
};

export type ServerSideDataSource<T> = (filter: string) => Promise<T[]>;

@Component({
    selector: "multiselect-dropdown",
    templateUrl: "./multiselectDropdown.component.html",
    host: {"[class]": "defaultSettings.classes"},
    styleUrls: ["../../commonStyles/checkboxes.css", "../../commonStyles/loadSpinner.css", "./multiselectDropdown.component.css"],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor, OnChanges, DoCheck, AfterViewInit, Validator {

    @BlockUI() blockUI: NgBlockUI;

    @Input()
    serverSideDataSource: ServerSideDataSource<any> = null;
    waitingServerResponse: boolean = false;

    @Input()
    data: ListItem[] = [];

    @Input()
    settings: DropdownSettings<any>;

    @Output("onSelect")
    onSelect: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    @Output("onDeSelect")
    onDeSelect: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    @Output("onSelectAll")
    onSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<ListItem>>();

    @Output("onDeSelectAll")
    onDeSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<ListItem>>();

    @Output("onOpen")
    onOpen: EventEmitter<any> = new EventEmitter<any>();

    @Output("onClose")
    onClose: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(ItemComponent) itemTempl: ItemComponent;
    @ContentChild(BubbleComponent) bubbleTempl: BubbleComponent;

    @ViewChild("searchInput") searchInput: ElementRef;

    public myself = this;

    public selectedItems: ListItem[] | ListItem = [];
    public isActive: boolean = false;
    public isSelectAll: boolean = false;
    public groupedData: ListItem[];
    public filter: string = "";
    public chunkArray: any[];
    public scrollTop: any;
    public chunkIndex: any[] = [];
    public cachedItems: any[] = [];
    public totalRows: any;
    public itemHeight: any = 41.6;
    public screenItemsLen: any;
    public cachedItemsLen: any;
    public totalHeight: any;
    public scroller: any;
    public maxBuffer: any;
    public lastScrolled: any;
    public lastRepaintY: any;

    private onTouchedCallback: (_: any) => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    defaultSettings: DropdownSettings<any> = {
        singleSelection: false,
        text: "Select",
        enableCheckAll: true,
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        enableSearchFilter: false,
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: "",
        disabled: false,
        searchPlaceholderText: "Search",
        filterEnterInvitation: "Start enter filter to get options",
        showCheckbox: true,
        noDataLabel: "No Data Available",
        searchAutofocus: true,
        lazyLoading: false,
        serverSearchDelay: 300,
        getItemId: (item) => item["id"],
        getShownName: (item) => item["itemName"],
        filterFn: (item, filter: string) => item["itemName"].toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1
    };

    public parseError: boolean;

    constructor(
        private _elementRef: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef
    ) {

    }

    public nu(arg: any): boolean {
        return arg === undefined || arg == null;
    }

    ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
        this.totalRows = (this.data && this.data.length);
        this.cachedItems = this.data;
        this.screenItemsLen = Math.ceil(this.settings.maxHeight / this.itemHeight);
        this.cachedItemsLen = this.screenItemsLen * 3;
        this.totalHeight = this.itemHeight * this.totalRows;
        this.maxBuffer = this.screenItemsLen * this.itemHeight;
        this.lastScrolled = 0;
        this.renderChunk(0, this.cachedItemsLen / 2);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length === 0) {
                    this.selectedItems = [];
                }
            }
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
    }

    ngDoCheck() {
        if (this.selectedItems) {
            if (
                (<ListItem[]>this.selectedItems).length === 0 ||
                this.data.length === 0 ||
                (<ListItem[]>this.selectedItems).length < this.data.length
            ) {
                this.isSelectAll = false;
            }
        }
    }

    ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener("scroll", this.onScroll.bind(this));
        }
    }

    onItemClick(item: ListItem, index: number, evt: Event) {
        if (this.settings.disabled) {
            return false;
        }

        if (this.settings.singleSelection) {
            this.addSelected(item);
            this.onSelect.emit(item);
            return;
        }

        const found = this.isSelected(item);
        const limit = (<ListItem[]>this.selectedItems).length < this.settings.limitSelection;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            } else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }

        } else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > (<ListItem[]>this.selectedItems).length) {
            this.isSelectAll = false;
        }
        if (this.data.length === (<ListItem[]>this.selectedItems).length) {
            this.isSelectAll = true;
        }
    }

    public validate(c: FormControl): any {
        return null;
    }

    writeValue(value: any) {
        if (value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                this.selectedItems = value;
                /*try {
                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new MultiselectDropdownException(404,
                            {"msg": "Single Selection Mode, Selected Items cannot have more than one item."});
                    } else {
                        this.selectedItems = value;
                    }
                } catch (e) {
                    console.error(e.body.msg);
                }*/
            } else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                } else {
                    this.selectedItems = value;
                }
                if ((<ListItem[]>this.selectedItems).length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = this.settings.singleSelection ? null : [];
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    trackByFn(index: number, item: ListItem) {
        return this.settings.getItemId(item);
    }

    isSelected(clickedItem: ListItem) {
        let found = false;

        if (this.settings.singleSelection) {
            if (this.selectedItems) {
                if (this.settings.getItemId(clickedItem) === this.settings.getItemId(this.selectedItems)) {
                    found = true;
                }
            }
        } else {
            if (this.selectedItems) {
                (<ListItem[]>this.selectedItems).forEach(item => {
                    if (this.settings.getItemId(clickedItem) === this.settings.getItemId(item)) {
                        found = true;
                    }
                });
            }
        }
        return found;
    }

    addSelected(item: ListItem) {
        if (this.settings.singleSelection) {
            this.selectedItems = item;
            /*this.selectedItems = [];
            this.selectedItems.push(item);*/
            this.closeDropdown();
        } else {
            (<ListItem[]>this.selectedItems).push(item);
        }
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }

    removeSelected(clickedItem: ListItem) {
        if (this.selectedItems) {
            (<ListItem[]>this.selectedItems).forEach(item => {
                if (this.settings.getItemId(clickedItem) === this.settings.getItemId(item)) {
                    (<ListItem[]>this.selectedItems).splice((<ListItem[]>this.selectedItems).indexOf(item), 1);
                }
            });
        }
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }

    toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.settings.enableSearchFilter) {
                setTimeout(() => {
                    this.searchInput.nativeElement.focus();
                }, 0);
            }
            this.onOpen.emit(true);
        } else {
            this.onClose.emit(false);
        }
        evt.preventDefault();
    }

    closeDropdown() {
        this.filter = "";
        this.isActive = false;
        this.onClose.emit(false);
    }

    toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onSelectAll.emit(this.selectedItems);
        } else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onDeSelectAll.emit(this.selectedItems);
        }
    }

    transformData(arr: ListItem[], field: any): ListItem[] {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({key: x, value: groupedObj[x]});
        });
        return tempArr;
    }

    renderChunk(fromPos: any, howMany: any) {
        this.chunkArray = [];
        this.chunkIndex = [];
        let finalItem = fromPos + howMany;
        if (finalItem > this.totalRows) {
            finalItem = this.totalRows;
        }

        for (let i = fromPos; i < finalItem; i++) {
            this.chunkIndex.push((i * this.itemHeight) + "px");
            this.chunkArray.push(this.data[i]);
        }
    }

    public onScroll(e: any) {
        this.scrollTop = e.target.scrollTop;
        this.updateView(this.scrollTop);

    }

    public updateView(scrollTop: any) {
        const scrollPos = scrollTop ? scrollTop : 0;
        let first = (scrollPos / this.itemHeight) - this.screenItemsLen;
        const firstTemp = "" + first;
        first = parseInt(firstTemp, 10) < 0 ? 0 : parseInt(firstTemp, 10);
        this.renderChunk(first, this.cachedItemsLen);
        this.lastRepaintY = scrollPos;
    }

    public filterInfiniteList(e: any) {
        let filteredElems: any[] = [];
        this.data = this.cachedItems.slice();
        const filter: string = e.target.value.toString();
        if (filter !== "") {
            filteredElems = this.data.filter((item: any) => this.settings.filterFn(item, filter));
            // this.cachedItems = this.data;
            this.totalHeight = this.itemHeight * filteredElems.length;
            this.totalRows = filteredElems.length;
            this.data = [];
            this.data = filteredElems;
            this.updateView(this.scrollTop);
        } else if (filter === "" && this.cachedItems.length > 0) {
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
    }

    private lastSearchTime: Date;
    private searchQueue: string[] = [];
    public onFilterChange(e: any) {
        if (!this.serverSideDataSource) {
            return;
        }

        const filter: string = e.target.value.toString();
        this.searchQueue.push(filter);

        setTimeout(() => {
            if (filter !== this.searchQueue[this.searchQueue.length - 1]) {
                return;
            }

            const now = new Date();
            this.lastSearchTime = now;
            const localLastSearchTime = now;

            this.waitingServerResponse = true;
            this.serverSideDataSource(filter)
                .then(result => {
                    if (this.lastSearchTime.getTime() !== localLastSearchTime.getTime()) {
                        return;
                    }
                    this.searchQueue = [];
                    this.data = filter ? result : [];
                    this.waitingServerResponse = false;
                })
                .catch(() => {/* todo error checking */});
        }, this.settings.serverSearchDelay);
    }
/*
    private lastSearchTime: Date;
    public onFilterChange(e: any) {
        if (!this.serverSideDataSource) {
            return;
        }

        const filter: string = e.target.value.toString();

        const now = new Date();

        this.lastSearchTime = now;
        const localLastSearchTime = now;

        this.waitingServerResponse = true;
        this.serverSideDataSource(filter)
            .then(result => {
                if (this.lastSearchTime.getTime() != localLastSearchTime.getTime()) {
                    return;
                }
                this.data = filter ? result : [];
                this.waitingServerResponse = false;
            })
            .catch(() => {/!* todo error checking *!/});
    }*/
}
