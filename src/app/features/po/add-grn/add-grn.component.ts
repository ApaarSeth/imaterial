import { Component, OnInit } from "@angular/core";
import { GRNDetails } from 'src/app/shared/models/grn';
import { ActivatedRoute } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn/grn.service';

@Component({
    selector: "add-grn",
    templateUrl: "./add-grn.component.html",
    styleUrls: ["/../../../../assets/scss/main.scss"]
})


export class AddGRNComponent implements OnInit {

    grnDetails: GRNDetails;
    grnId: number;

    displayedColumns: string[] = [
        "Material Name",
        "Awarded Quantity",
        "Delivered Quantity",
        "Certified Quantity"
    ];

    constructor(private activatedRoute: ActivatedRoute, private grnService: GRNService) { }

    ngOnInit() {
        this.getGRNDetails(1);
    }

    getGRNDetails(grnId: number) {
        this.grnService.getGRNDetails(grnId).then(data => {
            console.log("grn data", data.data);
            this.getGRNDetails = data.data;
        });
    }

    postGRNDeatils(organizationId: number, purchaseOrderId: number) {
        var grn: GRNDetails[];

        this.grnService.postGRNDetails(organizationId, purchaseOrderId, grn).then(data => {
            console.log("data", data);
        })
    }
}