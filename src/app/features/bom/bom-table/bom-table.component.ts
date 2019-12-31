import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-bom-table",
  templateUrl: "./bom-table.component.html",
  styleUrls: ["./bom-table.component.scss"]
})
export class BomTableComponent implements OnInit {
  constructor() {}
  @Input("selectedCategory") selectedCategory;
  ngOnInit() {
    console.log(this.selectedCategory);
  }
}
