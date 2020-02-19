import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: "app-ref-detail",
  templateUrl: "./ref-detail.component.html"
})
export class RefDetailComponent implements OnInit {
  constructor(private rfqService: RFQService) {}
 // openRfqList: RfqList[];
  closeRfqListTemp: RfqList[];

   openRfqList: MatTableDataSource<RfqList>;
   closeRfqList: MatTableDataSource<RfqList>;


  displayedColumns = [
    "RFQ Name",
    "Raised Date",
    "End Date",
    "Projects",
    "Total Material",
    "Total Supplier",
    "action1",
    "action2"
  ];
  ngOnInit() {
    let orgId=Number(localStorage.getItem("orgId"))
    this.rfqService.rfqDetail(orgId).then(res => {
      this.openRfqList = new MatTableDataSource(res.data.openRfqList);
      this.closeRfqList = new MatTableDataSource(res.data.closeRfqList);
      this.closeRfqListTemp = res.data.closeRfqList;

        this.openRfqList.filterPredicate = (data, filterValue) => {
                const dataStr = data.rfqName + data.createdAt.toString() + data.rfqDueDate.toString()  + data.projectCount.toString() + data.materialCount.toString();
                return dataStr.indexOf(filterValue) != -1; 
                }

  this.closeRfqList.filterPredicate = (data, filterValue) => {
                const dataStr = data.rfqName + data.createdAt.toString() + data.rfqDueDate.toString() + data.projectCount.toString() + data.materialCount.toString();
                return dataStr.indexOf(filterValue) != -1; 
                }

    });
  }

    applyFilter(filterValue: string) {
        this.openRfqList.filter = filterValue.trim().toLowerCase();
      this.closeRfqList.filter =filterValue.trim().toLowerCase();

      }

}
