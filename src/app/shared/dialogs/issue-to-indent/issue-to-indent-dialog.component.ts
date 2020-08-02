import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IssueToIndentDetails, IndentVO, sendIssuedQuantityObj } from '../../models/issue-to-indent';
import { BomService } from '../../services/bom/bom.service';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { AppNavigationService } from '../../services/navigation.service';
@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html",
  styleUrls: ["../../../../assets/scss/main.scss"]

})

export class IssueToIndentDialogComponent implements OnInit {

  issueToIndentDetails: IssueToIndentDetails;
  materialForms: FormGroup;
  dataSource: IndentVO;
  sum: number = 0;
  errorMsg: boolean = false;

  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>, private activatedRoute: ActivatedRoute,
    private bomService: BomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private navService: AppNavigationService,
  ) { }

  ngOnInit() {
    this.getIndentDetails();

  }


  formsInit(indentDetail) {
    const num = Number(this.issueToIndentDetails.availableStock);

    const frmArr = indentDetail.indentDetailList.map((indent: IndentVO) => {
      return this.formBuilder.group({
        indentId: [indent.indentId],
        issuedQty: ["", [Validators.max(num)]],
        issuedDate: [indent.dueDate],
        requiredQuantity: [indent.quantity]
      });
    });


    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });

  }

  showIndent() {
    this.dialogRef.close(this.raiseIndent());
  }

  showQuantityInput() {
    this.sum = 0;
    this.materialForms.value.forms.forEach(element => {
      if (element.issuedQty > 0) {
        this.sum = this.sum + element.issuedQty;
      }
    });

    const num = Number(this.issueToIndentDetails.availableStock);
    if (this.sum < num) {
      this.errorMsg = false;
    }
    else if (this.sum > num) {
      this.errorMsg = true;
    }
  }
  raiseIndent() {
    const formValues: sendIssuedQuantityObj[] = [];
    this.materialForms.value.forms.forEach(element => {
      element.issuedQty = Number(element.issuedQty);
      if (element.issuedQty > 0) {
        formValues.push(element);
      }
    });
    this.bomService.postIssueToIndent(this.data.materialId, formValues).then(res => {
      if (res.status == 1) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'issue_to_indent',
          label: null,
          value: null
        });
      }
      return res.data;
    });

  }

  getIndentDetails() {
    this.bomService.getIssueToIndent(this.data.materialId, this.data.projectId).then(data => {
      this.issueToIndentDetails = data.data;
      this.formsInit(this.issueToIndentDetails);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
