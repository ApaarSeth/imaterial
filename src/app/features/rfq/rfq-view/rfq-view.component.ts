import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RFQService } from "src/app/shared/services/rfq.service";
import { ActivatedRoute } from '@angular/router';
import { Rfq, TermsObj } from 'src/app/shared/models/RFQ/rfq-view';
import { CommonService } from 'src/app/shared/services/commonService';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

@Component({
    selector: "rfq-view",
    templateUrl: "./rfq-view.component.html"
})

export class RFQViewComponent implements OnInit {

    displayedColumns: string[] = ["Material Name", "Required Date", "Quantity", "Attached Images", "Makes"];
    rfqDetails: Rfq = {} as Rfq;
    rfqId: number;
    terms: TermsObj;
    isMobile: boolean;

    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private rfqService: RFQService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.route.params.subscribe(rfqId => {
            this.rfqId = Number(rfqId.id);
            this.getRFQDetails(this.rfqId);
        });
    }

    getRFQDetails(rfqId: number) {
        this.rfqService.getRFQView(rfqId).then(res => {
            this.rfqDetails = res.data;
        });
    }

    /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
    viewAllImages(materialId) {
        const dialogRef = this.dialog.open(ViewImageComponent, {
            disableClose: true,
            width: "500px",
            panelClass: ['common-modal-style', 'view-image-modal'],
            data: {
                rfqId: this.rfqId,
                materialId,
                type: 'rfq'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log(result);
            }
        });
    }
}
