import {FormControl, FormGroup} from '@angular/forms';

export class FormHelper {

    /**
     * @desc function to check all the form's fields are valid or not.
     * @param formGroup : FormGroup Object.
     * @return boolean: true or false
     */
    static validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    static noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        return (!isWhitespace) ? null : {'whitespace': true};
    }
}
