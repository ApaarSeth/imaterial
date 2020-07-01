import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "view-rating",
    templateUrl: "./view-rating.component.html",
    styleUrls: [ "../../../../assets/scss/main.scss" ]
})

export class ViewRatingComponent implements OnInit {

    @Input('ratings') ratings: number;
    @Input('supplierId') supplierId: number;

    constructor() { }

    ngOnInit() {}
}
