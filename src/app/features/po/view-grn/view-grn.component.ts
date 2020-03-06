import { Component, OnInit } from "@angular/core";
import { GRNDetails, GRNPopupData } from 'src/app/shared/models/grn';
import { ActivatedRoute, Router } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn/grn.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddEditGrnComponent } from 'src/app/shared/dialogs/add-edit-grn/add-edit-grn.component';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';

@Component({
    selector: "view-grn",
    templateUrl: "./view-grn.component.html",
    styleUrls: ["/../../../../assets/scss/main.scss"]
})


export class ViewGRNComponent implements OnInit {

    grnDetails: GRNDetails[];
    grnId: number;
    grnAddEditDetails: GRNDetails;
    grnAddEditId: number;
    dataSource: GRNDetails[];
    displayedColumns: string[] = [
        "Material Name",
        "Brand Name",
        "Awarded Quantity",
        "Certified Quantity"
    ];
    grnHeaders: any;
    pID: number;

    public GRNTour: GuidedTour = {
        tourId: 'grn-tour',
        useOrb: false,
        steps: [
             {
              title:'Add GRN',
              selector: '.add-grn-btn',
              content: 'Click here to add the quantity of material which has been received & certified.',
              orientation: Orientation.Left
            }
        ]
    };

    constructor(private activatedRoute: ActivatedRoute, private grnService: GRNService, private route: Router, public dialog: MatDialog,private guidedTourService: GuidedTourService){
        setTimeout(() => {
            this.guidedTourService.startTour(this.GRNTour);
        }, 1000);

     }

    ngOnInit() {
        this.activatedRoute.params.subscribe(res => {
            this.pID = Number(res["poId"]);
            this.getGRNDetails(Number(res["poId"]));
        })
    }

    getGRNDetails(grnId: number) {
        this.grnService.getGRNDetails(grnId).then(data => {
            this.grnHeaders = data.data;
            //this.grnDetails = data.data.poMaterialList;
        });
    }

    getData(x) {
        return x
    }

    viewBack() {
        this.route.navigate(['po/detail-list']);
    }

    addGRN() {
        const data: GRNPopupData = {
            isEdit: false,
            isDelete: false,
            pID: this.pID,
            detail: this.grnHeaders
        };
        this.openDialog(data);
    }

    openDialog(data: GRNPopupData): void {
        if (data.isDelete == false) {
            const dialogRef = this.dialog.open(AddEditGrnComponent, {
                width: "1000px",
                data
            });
            dialogRef.afterClosed().toPromise().then(result => {
                if(result){
                    this.getGRNDetails(this.pID);
                }
            });
        }
    }
}