import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-chip",
  templateUrl: "chip.component.html"
})
export class ChipComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: string[] = [];

  @Output() onUpdate = new EventEmitter<string[]>();

  ngOnInit(): void {}
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim() && this.fruits.length < 4) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.update();
  }

  update() {
    this.onUpdate.emit(this.fruits);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }

    this.update();
  }
}
