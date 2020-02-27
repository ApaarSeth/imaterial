import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from "@angular/core";

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
  @Input("chips") chips: string[];
  @Output() onUpdate = new EventEmitter<string[]>();

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.chips) {
      // console.log("chips", this.chips)
      this.fruits = [...this.chips];
      // console.log("fruits", this.fruits)
      this.update();
    }
    // this.update();
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim() && this.fruits.length < 5) {
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
