import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BomService } from "../../services/bom.service";

@Component({
  selector: "delete-bom-dialog",
  templateUrl: "delete-bom-component.html"
})

export class DeleteBomComponent implements OnInit {

  constructor(
    private bomService: BomService,
    private dialogRef: MatDialogRef<DeleteBomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  deactivateBomService() {
    this.bomService
      .deleteMaterial(this.data.materialId, this.data.projectId)
      .then(res => res.data);
  }

  cancel() {
    this.dialogRef.close({ data: "close" });
  }

  deactivateMaterial() {
    this.bomService
      .deleteMaterial(this.data.materialId, this.data.projectId)
      .then(res => {
        res.data;
        this.dialogRef.close(this.deactivateBomService());
      });
  }
}
