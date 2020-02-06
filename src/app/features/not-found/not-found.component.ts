import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-not-found",
  // templateUrl: './not-found.component.html',
  template: `
    <div class="container">
      <div class="row not-found">
        <div class="col-md-12 my-4 text-center">
          <img src="assets/images/not-found-medium.jpg" class="img-fluid" />
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
