export class ListItem {
    id: Number;
    itemName: String;
}

export class MultiselectDropdownException {
    status: number;
    body: any;
    constructor(status: number, body: any) {
        this.status = status;
        this.body = body;
    }
}
