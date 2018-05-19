import {Directive, forwardRef} from "@angular/core";
import {FormControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
    selector: "[notEmptyArray][ngModel]",
    providers: [
        { provide: NG_VALIDATORS, useClass: NotEmptyArrayDirective, multi: true }
    ]
})
export class NotEmptyArrayDirective implements Validator {
    validate(c: FormControl) {
        const isValid: boolean = c.value && c.value.length && c.value.length > 0;

        if (isValid) {
            return null;
        } else {
            return {
                notEmptyArray: {
                    valid: false
                }
            };
        }
    }
}
