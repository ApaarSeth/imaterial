import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "supplier-rating-dialog",
  templateUrl: "supplier-rating.component.html"
})

export class SupplierRatingComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SupplierRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  rating: number;

  ngOnInit() {

  }
  
  closeDialog() {
    this.dialogRef.close('closed');
  }

  checkRating(rating: number): void {
    this.rating = rating;
  }

  ratingSubmission(){
    this.dialogRef.close(this.rating);
  }

}