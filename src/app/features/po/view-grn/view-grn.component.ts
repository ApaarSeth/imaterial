import { Component, OnInit } from "@angular/core";
import { GRNDetails } from 'src/app/shared/models/grn';
import { ActivatedRoute } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn/grn.service';

@Component({
    selector: "view-grn",
    templateUrl: "./view-grn.component.html",
    styleUrls: ["/../../../../assets/scss/main.scss"]
})


export class ViewGRNComponent implements OnInit {

    grnDetails: GRNDetails;
    grnId: number;

    displayedColumns: string[] = [
        "Material Name",
        "Awarded Quantity",
        "Certified Quantity",
        "Date"
    ];

    constructor(private activatedRoute: ActivatedRoute, private grnService: GRNService) { }

    ngOnInit() {
        this.getGRNDetails(1);
    }

    getGRNDetails(grnId: number) {
        this.grnService.getGRNDetails(grnId).then(data => {
            console.log("grn data", data.data);
            this.grnDetails = data.data;
        });
    }
}