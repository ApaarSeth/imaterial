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
    grnDetailsObj: GRNDetails[];

    dataSource = [
        {
            "materialName": "name",
            "awardedQuantity": 23,
            "deliveredQuantity": 21,
            "certifiedQuantity": 22
        }
    ]

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
            this.grnDetails = data.data;
            this.grnDetailsObj = data.data;
            console.log("object", this.grnDetailsObj);

        });
    }

    // postGRNDetails(organizationId: number, purchaseOrderId: number) {
    //     console.log("object", this.grnDetailsObj);
    //     this.grnService.postGRNDetails(organizationId, purchaseOrderId, this.grnDetailsObj).then(data => {
    //         console.log("data", data);
    //     })
    // }
}