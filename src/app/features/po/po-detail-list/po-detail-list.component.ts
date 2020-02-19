import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PODetailLists, PurchaseOrder } from "src/app/shared/models/po-details/po-details-list";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: "po-detail-list",
  templateUrl: "./po-detail-list.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class PODetailComponent implements OnInit {
  poDetails: MatTableDataSource<PODetailLists>;

  poDraftedDetails: MatTableDataSource<PurchaseOrder>;
  poApprovalDetails: MatTableDataSource<PurchaseOrder>;
  acceptedRejectedPOList:MatTableDataSource<PurchaseOrder>;

  poDetailsTemp : PurchaseOrder[] = [];

poDraftedDetailsTemp : PurchaseOrder[] = [];

poApprovalDetailsTemp : PurchaseOrder[] = [];

acceptedRejectedPOListTemp : PurchaseOrder[] = [];



  displayedColumns = [
    "PO Number",
    "Raised Date",
    "Total Material",
    "PO Amount",
    "ViewPo",
    "ViewGRN",
    "AddGRN"
  ];

  constructor(private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    this.poDetails = new MatTableDataSource(this.activatedRoute.snapshot.data.poDetailList);
     
     
     
     this.acceptedRejectedPOList = new MatTableDataSource(this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList);

     this.poDraftedDetails = new MatTableDataSource(this.activatedRoute.snapshot.data.poDetailList.draftedPOList);
      this.poApprovalDetails = new MatTableDataSource(this.activatedRoute.snapshot.data.poDetailList.sendForApprovalPOList);

       this.poDetailsTemp = this.activatedRoute.snapshot.data.poDetailList;
     this.poDraftedDetailsTemp = this.activatedRoute.snapshot.data.poDetailList.draftedPOList;
      this.poApprovalDetailsTemp = this.activatedRoute.snapshot.data.poDetailList.sendForApprovalPOList;
        this.acceptedRejectedPOListTemp = this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList;



  this.acceptedRejectedPOList = new MatTableDataSource(this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList);


     this.acceptedRejectedPOList.filterPredicate = (data, filterValue) => {
                const dataStr = data.approvedOn + data.poAmount.toString() + data.poName +data.poNumber.toString() +data.totalMaterials.toString() + data.poStatus +data.approvedBy;
                return dataStr.indexOf(filterValue) != -1; 
                }

  this.poDraftedDetails.filterPredicate = (data, filterValue) => {
                const dataStr = data.approvedOn + data.poAmount.toString() + data.poName +data.poNumber.toString() + data.totalMaterials.toString() + data.poStatus +data.approvedBy;
                return dataStr.indexOf(filterValue) != -1; 
                }

  this.poApprovalDetails.filterPredicate = (data, filterValue) => {
                const dataStr = data.approvedOn + data.poAmount.toString() + data.poName +data.poNumber.toString() + data.totalMaterials.toString() + data.poStatus +data.approvedBy;
                return dataStr.indexOf(filterValue) != -1; 
                }

    console.log("poDetails", this.poDetails);
  }


  viewPO(purchaseOrderId){
    this.route.navigate(['../../po/po-generate/'+purchaseOrderId+'/view']);
  }
    applyFilter(filterValue: string) {
        this.acceptedRejectedPOList.filter = filterValue.trim().toLowerCase();
     this.poDraftedDetails.filter =filterValue.trim().toLowerCase();
      this.poApprovalDetails.filter =filterValue.trim().toLowerCase();

      }

  
}
