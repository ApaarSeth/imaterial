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

@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html",
  styleUrls: ["../../../../assets/scss/main.scss"]

})

export class IssueToIndentDialogComponent implements OnInit {

  issueToIndentDetails: IssueToIndentDetails;
  materialForms: FormGroup;
  dataSource: IndentVO;

  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>, private activatedRoute: ActivatedRoute,
    private bomService: BomService,
     @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getIndentDetails();

  }


  formsInit(indentDetail) {
    const frmArr = indentDetail.indentDetailList.map((indent: IndentVO) => {
      return this.formBuilder.group({
        indentId: [indent.indentId],
        issuedQty: ["", Validators.required],
        issuedDate: [indent.dueDate],
        requiredQuantity: [indent.quantity]
      });
    });


    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });

    console.log(this.materialForms);
  }

  showIndent() {
     this.dialogRef.close(this.raiseIndent());
  }

  raiseIndent(){
     const formValues: sendIssuedQuantityObj[] = [];
    this.materialForms.value.forms.forEach(element => {
      if(element.issuedQty > 0){
       formValues.push(element);
      }
    });
   
    console.log("result", formValues);

    this.bomService.postIssueToIndent(this.data.materialId, formValues).then(res => {
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
