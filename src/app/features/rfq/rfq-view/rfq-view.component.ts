import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ViewDocumentsDialogComponent } from "src/app/shared/dialogs/view-documents/view-documents-dialog.component";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ActivatedRoute } from '@angular/router';
import { Rfq, Documents, TermsObj } from 'src/app/shared/models/RFQ/rfq-view';

@Component({
    selector: "rfq-view",
    templateUrl: "./rfq-view.component.html",
    styleUrls: ["../../../../assets/scss/main.scss"]
})
export class RFQViewComponent implements OnInit {
    displayedColumns: string[] = ["Material Name", "Required Date", "Quantity", "Makes"];
    rfqDetails: Rfq = {} as Rfq;
    rfqId: number;
    terms: TermsObj;

    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private rfqService: RFQService
    ) { }

    ngOnInit() {
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

    // openDialog1(documentsList: Documents, terms: TermsObj): void {
    //     if (ViewDocumentsDialogComponent) {
    //         const dialogRef = this.dialog.open(ViewDocumentsDialogComponent, {
    //             width: "1200px",
    //             data: { documentsList, terms }

    //         });
    //         dialogRef.afterClosed().subscribe(result => {
    //         });
    //     }
    // }
}
