import { Component, OnInit, Input } from "@angular/core";
import { CommonService } from '../../services/commonService';

@Component({
    selector: "view-rating",
    templateUrl: "./view-rating.component.html"
})

export class ViewRatingComponent implements OnInit {

    @Input('ratings') ratings: number;
    @Input('supplierId') supplierId: number;

    isMobile: boolean;

    constructor(
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        // console.log(this.ratings)
        // console.log(this.supplierId);

    }
}
