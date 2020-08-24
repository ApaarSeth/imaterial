import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-select-check-all',
    templateUrl: "./select-check-all.component.html"
})

export class SelectCheckAllComponent {
    @Input() model: FormControl;
    @Input() values = [];
    @Input() text = 'Select All';
    @Output() selectAllText = new EventEmitter<string>();

    ngOnInit(): void { }

    isChecked(): boolean {
        return this.model.value && this.values.length
            && this.model.value.length === this.values.length;
    }

    toggleSelection(change: MatCheckboxChange): void {
        if (change.checked) {
            this.model.setValue(this.values);
            this.selectAllText.emit(this.text);
        } else {
            this.model.setValue([]);
            this.selectAllText.emit('');
        }
    }
}