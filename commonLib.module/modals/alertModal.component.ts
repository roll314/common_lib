import {Component} from "@angular/core";
import {AbstractModalComponent} from "../modal.component/modal.service";

export class AlertModalComponentData {
    constructor(
        public title: string,
        public showTitle: boolean,
        public message: string
    ) {}

}

@Component({
    selector: "alert-modal",
    template: `
        <div  class="modal-content">
            <div  class="modal-header">
                <h5  class="modal-title" style="display:  inline;">{{data.title}}</h5>
                <button class="close" type="button" style="margin-top: 3px; display: inline;">
                    <span (click)="close(null)">×</span>
                </button>
            </div>
            <div  class="modal-body">
                <p >Modal body text goes here.</p>
            </div>
            <div  class="modal-footer">
                <button  class="btn btn-secondary" type="button">Close</button>
                <button  class="btn btn-primary" type="button" (click)="close(null);">Close</button>
            </div>
        </div>
    `
})
export class AlertModalComponent extends AbstractModalComponent<AlertModalComponentData, void> {

    public data: AlertModalComponentData;
}
