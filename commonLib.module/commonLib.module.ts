import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CalendarComponent} from "./datePicker/calendar.component/calendar.component";
import {MonthPickerComponent} from "./datePicker/monthPicker.component/monthPicker.component";
import {YearPickerComponent} from "./datePicker/yearPicker.component/yearPicker.component";
import {DatePickerComponent} from "./datePicker/datePicker.component/datePicker.component";
import {
    BubbleComponent, ItemComponent,
    TemplateRendererComponent
} from "./multiselectDropdown.component/templateRenderer.component";
import {ListFilterPipe} from "./multiselectDropdown.component/listFilter.pipe";
import {MultiSelectComponent} from "./multiselectDropdown.component/multiselectDropdown.component";
import {ClickOutsideDirective} from "./clickOutside.directive/clickOutside.directive";
import {StyleDirective} from "./multiselectDropdown.component/styleProp.directive";
import {ScrollDirective} from "./multiselectDropdown.component/scroll.directive";
import {AlertModalComponent} from "./modals/alertModal.component";
import {GalleryImagesComponent} from "../checkListBuilder.module/galleryImages.component/galleryImages.component";
import {SwitcherComponent} from "./switcher.component/switcher.component";
import {ModalComponent} from "./modal.component/modal.component";
import {TooltipContentComponent} from "./tooltip.component/tooltipСontent.component";
import {GalleryImageComponent} from "./galleryImage.component/galleryImage.component";
import {ConfirmModalComponent} from "./modals/confirmModal.component";
import {TooltipDirective} from "./tooltip.component/tooltip.directive";
import {DropdownDatePickerComponent} from "./datePicker/dropdownDatePicker.component/dropdownDatePicker.component";
import {DropdownNotClosableZoneDirective} from "./dropdown.component/dropdownNotClosableZone.directive";
import {DropdownOpenDirective} from "./dropdown.component/dropdownOpen.directive";
import {DropdownDirective} from "./dropdown.component/dropdown.directive";
import {DateRangePickerComponent} from "./datePicker/dateRangePicker.component/dateRangePicker.component";
import {DropdownDateRangePickerComponent} from "./datePicker/dropdownDateRangePicker.component/dropdownDateRangePicker.component";
import {GridComponent} from "./grid/grid.component/grid.component";
import {DynamicComponent} from "./dinamic.component/dynamic.component";
import {DynamicComponentCreationService} from "./dinamic.component/dynamicComponentCreation.service";
import {CommonHeaderComponent} from "./grid/headerComponents/commonHeader.component";
import {CommonCellComponent} from "./grid/cellComponents/commonCell.component";
import {PaginationComponent} from "./grid/paginaton.component/paginaton.component";
import {IconCellComponent} from "./grid/cellComponents/iconCell.component";
import {NotEmptyArrayDirective} from "./notEmptyArray.directive/notEmptyArray.directive";
import {PlanningCalendarComponent} from "./datePicker/planningCalendar.component/planningCalendar.component";
import {SwitcherCellComponent} from "./grid/cellComponents/switcherCell.component";
import {DropDownActionComponent} from "./grid/cellComponents/dropDownActionCell.component";
import {
    StyledCommonCellComponent,
    StyledCommonCellComponentData
} from "./grid/cellComponents/styledCommonCell.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        // Thirdparty
    ],
    declarations: [
        ClickOutsideDirective,

        DynamicComponent,
        NotEmptyArrayDirective,

        // Grid
        GridComponent,
        CommonHeaderComponent,
        CommonCellComponent,
        IconCellComponent,
        SwitcherCellComponent,
        DropDownActionComponent,
        StyledCommonCellComponent,

        // DropDown
        DropdownNotClosableZoneDirective,
        DropdownDirective,
        DropdownOpenDirective,

        // MultiSelect
        MultiSelectComponent,
        ScrollDirective,
        StyleDirective,
        ListFilterPipe,
        ItemComponent,
        BubbleComponent,
        TemplateRendererComponent,

        // DatePicker
        CalendarComponent,
        MonthPickerComponent,
        YearPickerComponent,
        DatePickerComponent,
        DropdownDatePickerComponent,
        DateRangePickerComponent,
        DropdownDateRangePickerComponent,
        PlanningCalendarComponent,

        // Modal
        ModalComponent,
        AlertModalComponent,
        ConfirmModalComponent,
        GalleryImagesComponent,

        // Other
        SwitcherComponent,
        GalleryImageComponent,
        TooltipContentComponent,
        TooltipDirective,
        PaginationComponent,
    ],
    exports: [
        ClickOutsideDirective,

        DynamicComponent,
        NotEmptyArrayDirective,

        // Grid
        GridComponent,
        CommonHeaderComponent,
        CommonCellComponent,
        IconCellComponent,
        SwitcherCellComponent,
        DropDownActionComponent,
        StyledCommonCellComponent,

        // DropDown
        DropdownNotClosableZoneDirective,
        DropdownDirective,
        DropdownOpenDirective,

        // MultiSelect
        MultiSelectComponent,
        ScrollDirective,
        StyleDirective,
        ListFilterPipe,
        ItemComponent,
        BubbleComponent,
        TemplateRendererComponent,

        // DatePicker
        CalendarComponent,
        MonthPickerComponent,
        YearPickerComponent,
        DatePickerComponent,
        DropdownDatePickerComponent,
        DateRangePickerComponent,
        DropdownDateRangePickerComponent,
        PlanningCalendarComponent,

        // Modal
        ModalComponent,
        AlertModalComponent,
        ConfirmModalComponent,
        GalleryImagesComponent,

        // Other
        SwitcherComponent,
        GalleryImageComponent,
        TooltipContentComponent,
        TooltipDirective,
        PaginationComponent
    ],
    providers: [
        DynamicComponentCreationService
    ],
    entryComponents: [
        DynamicComponent,

        // Grid
        CommonHeaderComponent,
        CommonCellComponent,
        IconCellComponent,
        SwitcherCellComponent,
        DropDownActionComponent,
        StyledCommonCellComponent,

        TooltipContentComponent,
        ModalComponent,
        ConfirmModalComponent,
        DateRangePickerComponent
    ]
})
export class ComponentsLibModule {
}
