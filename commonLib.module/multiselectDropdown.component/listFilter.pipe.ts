import {Pipe, PipeTransform} from '@angular/core';

import {ListItem} from './model';
import {FilterFn} from './DropdownSettings';

@Pipe({
    name: 'listFilter',
    pure: false
})
export class ListFilterPipe implements PipeTransform {
    transform(items: ListItem[], filter: any, filterFn: FilterFn<any>): ListItem[] {
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: any) => filterFn(item, filter));
    }
}
