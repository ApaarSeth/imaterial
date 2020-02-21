import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog } from '@angular/material';
import { ConfirmRfqBidComponent } from 'src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component';
@Component({
  selector: "rfq-supplier-after-bid",
  templateUrl: "./rfq-supplier-after-bid.component.html",
  styleUrls: [
    "../../../../assets/scss/main.scss",
    "../../../../assets/scss/pages/rfq-bids.component.scss"
  ]
})
export class RFQSupplierAfterBidComponent implements OnInit {

  materialCount: number = 0;
  brandCount: number = 0;


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService
  ) { }

  ngOnInit() {
    this.brandCount = this.activatedRoute.snapshot.params["brandList"];
    this.materialCount = this.activatedRoute.snapshot.params["MaterialList"];
  }

}