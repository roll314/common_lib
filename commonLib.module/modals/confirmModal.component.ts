import {Component} from "@angular/core";
import {AbstractModalComponent} from "../modal.component/modal.service";

export class ConfirmModalComponentData {
    constructor(
        public message: string = "No message",
        public title: string = "No title",
        public showTitle: boolean = true,
        public trueText: string  = "Apply",
        public falseText: string = "Cancel"
    ) {}
}

@Component({
    selector: "confirm-modal",
    template: `
        <div  class="modal-content">
            <div class="modal-header" *ngIf="data.showTitle">
                <h5  class="modal-title" style="display:  inline;">{{data.title}}</h5>
                <button class="close" type="button" style="margin-top: 3px; display: inline;">
                    <span (click)="close(false)">×</span>
                </button>
            </div>
            <div  class="modal-body" style="padding-bottom: 0px;">
                <p>{{data.message}}</p>
            </div>
            <div  class="modal-footer">
                <button  class="btn btn-secondary" type="button" (click)="close(false);">{{data.falseText}}</button>
                <button  class="btn btn-primary" type="button" (click)="close(true);">{{data.trueText}}</button>
            </div>
        </div>
    `
})
export class ConfirmModalComponent extends AbstractModalComponent<ConfirmModalComponentData, boolean> {

    public data: ConfirmModalComponentData;
}
