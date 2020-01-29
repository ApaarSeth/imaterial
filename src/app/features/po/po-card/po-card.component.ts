import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  ProjectAddress,
  SupplierAddress,
  CardData
} from "src/app/shared/models/PO/po-data";
import { MatDialog } from "@angular/material";
import { SelectApproverComponent } from "src/app/shared/dialogs/selectPoApprover/selectPo.component";
import { SelectPoRoleComponent } from "src/app/shared/dialogs/select-po-role/select-po-role.component";

@Component({
  selector: "app-po-card",
  templateUrl: "./po-card.component.html",
  styleUrls: ["./po-card.component.scss"]
})
export class PoCardComponent implements OnInit {
  @Input("cardData") cardData: CardData;
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder) {}
  projectDetails: FormGroup;
  @Input("viewMode") viewMode: boolean;

  ngOnInit() {
    this.formInit();
    console.log(this.cardData);
  }
  formInit() {
    this.projectDetails = this.formBuilder.group({
      orderNo: [],
      openingDate: [],
      endDate: ["2029-02-28T18:30:00.000Z"],
      billingAddress: [this.cardData.billingAddress],
      projectAddress: [this.cardData.projectAddress],
      supplierAddress: [this.cardData.supplierAddress],
      projectId: []
    });
  }
  submit() {
    console.log(this.projectDetails.value);
  }

  getData() {
    return this.projectDetails.value;
  }

  openDialog(roleType: string, projectId: number) {
    const dialogRef = this.dialog.open(SelectPoRoleComponent, {
      width: "700px",
      data: { roleType, projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      if (result[0] === "projectBillingUserId") {
        this.cardData.billingAddress.email = result[1].approver.email;
        this.cardData.billingAddress.contactNo = result[1].approver.contactNo;
        this.cardData.billingAddress.firstName = result[1].approver.firstName;
        this.cardData.billingAddress.lastName = result[1].approver.lastName;
        this.cardData.billingAddress.projectBillingUserId = result[0];
        this.projectDetails.controls["billingAddress"].setValue(
          this.cardData.billingAddress
        );
      } else {
        this.cardData.projectAddress.email = result[1].approver.email;
        this.cardData.projectAddress.contactNo = result[1].approver.contactNo;
        this.cardData.projectAddress.firstName = result[1].approver.firstName;
        this.cardData.projectAddress.lastName = result[1].approver.lastName;
        this.cardData.projectAddress.projectUserId = result[0];
        console.log(this.cardData.projectAddress);
        this.projectDetails.controls["projectAddress"].setValue(
          this.cardData.projectAddress
        );
      }
    });
  }
}
