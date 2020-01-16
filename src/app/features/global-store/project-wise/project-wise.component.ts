import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-project-wise",
  templateUrl: "./project-wise.component.html",
  styleUrls: ["./project-wise.component.scss"]
})
export class ProjectWiseComponent implements OnInit {
  @Input("projectData") projectData;

  constructor() {}

  ngOnInit() {
    console.log(this.projectData);
  }
}
