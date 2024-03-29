import { Component, OnInit } from "@angular/core";
import { GRNDetails, GRNPopupData } from 'src/app/shared/models/grn';
import { ActivatedRoute, Router } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditGrnComponent } from 'src/app/shared/dialogs/add-edit-grn/add-edit-grn.component';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide.service';
import { POService } from 'src/app/shared/services/po.service';
import { POData } from 'src/app/shared/models/PO/po-data';
import { CommonService } from 'src/app/shared/services/commonService';
import { ShowDocumentComponent } from 'src/app/shared/dialogs/show-documents/show-documents.component';



@Component({
    selector: "view-grn",
    templateUrl: "./view-grn.component.html"
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
        "Delivered Date",
        "Delivered Quantity"
    ];
    grnHeaders: any;
    poId: number;
    poData: POData
    public GRNTour: GuidedTour = {
        tourId: 'grn-tour',
        useOrb: false,
        steps: [
            {
                title: 'Add Receipts',
                selector: '.add-grn-btn',
                content: 'Click here to add the quantity of material which has been received & certified.',
                orientation: Orientation.Left
            }
        ],
        skipCallback: () => {
            this.setLocalStorage()
        },
        completeCallback: () => {
            this.setLocalStorage()
        }
    };
    userId: number;

    constructor(private poService: POService, private activatedRoute: ActivatedRoute, private grnService: GRNService, private route: Router, public dialog: MatDialog, private guidedTourService: GuidedTourService, private userGuideService: UserGuideService, private commonService: CommonService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(res => {
            this.poId = Number(res["poId"]);
            this.poService.getPoGenerateData(this.poId).then(res => {
                this.poData = res.data;
                if ((localStorage.getItem('grn') == "null") || (localStorage.getItem('grn') == '0')) {
                    setTimeout(() => {
                        this.guidedTourService.startTour(this.GRNTour);
                    }, 1000);
                }
            })
            this.getGRNDetails(Number(res["poId"]));
        })
        this.getNotifications();
    }

    getNotifications() {
        this.commonService.getNotification(this.userId);
    }

    setLocalStorage() {
        this.userId = Number(localStorage.getItem("userId"));
        const popovers = {
            "userId": this.userId,
            "moduleName": "grn",
            "enableGuide": 1
        };
        this.userGuideService.sendUserGuideFlag(popovers).then(res => {
            if (res) {
                localStorage.setItem('grn', '1');
            }
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
        this.route.navigate(['po']);
    }

    addGRN() {
        const data: GRNPopupData = {
            isEdit: false,
            isDelete: false,
            pID: this.poId,
            detail: this.grnHeaders
        };
        this.openDialog(data);
    }

    openDocuments(data) {
        const dialogRef = this.dialog.open(ShowDocumentComponent, {
            width: "500px",
            data,
            panelClass: ['common-modal-style', 'show-docs-dialog']
        });
        dialogRef.afterClosed().toPromise().then(result => {
            if (result) {
                this.getGRNDetails(this.poId);
            }
        });
    }
    openDialog(data: GRNPopupData): void {
        if (data.isDelete == false) {
            const dialogRef = this.dialog.open(AddEditGrnComponent, {
                width: "1000px",
                data,
                panelClass: ['common-modal-style', 'add-receipts-dialog']
            });
            dialogRef.afterClosed().toPromise().then(result => {
                if (result) {
                    this.getGRNDetails(this.poId);
                }
            });
        }
    }
}