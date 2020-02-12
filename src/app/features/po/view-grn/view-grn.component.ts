import { Component, OnInit } from "@angular/core";
import { GRNDetails } from 'src/app/shared/models/grn';
import { ActivatedRoute, Router } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn/grn.service';

@Component({
    selector: "view-grn",
    templateUrl: "./view-grn.component.html",
    styleUrls: ["/../../../../assets/scss/main.scss"]
})


export class ViewGRNComponent implements OnInit {

    grnDetails: GRNDetails[];
    grnId: number;

    displayedColumns: string[] = [
        "Material Name",
         "Brand Name",
        "Awarded Quantity",
        "Certified Quantity"
    ];
    grnHeaders: any;

    constructor(private activatedRoute: ActivatedRoute, private grnService: GRNService,private route:Router) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(res=>{
            console.log(res);
            this.getGRNDetails(Number(res["poId"]));
        })
        
    }

    getGRNDetails(grnId: number) {
        this.grnService.getGRNDetails(grnId).then(data => {
            console.log("grn data", data.data);
            this.grnHeaders = data.data;
            //this.grnDetails = data.data.poMaterialList;
        });
    }

    getData(x){
        console.log(x)
        return x
    }
    viewBack(){
           this.route.navigate(['po/detail-list']);
    }
}