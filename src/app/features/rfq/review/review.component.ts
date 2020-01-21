import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AddCommentDialogComponent } from "src/app/shared/dialogs/add-comment/comment-dialog.component";
import { ViewDocumentsDialogComponent } from "src/app/shared/dialogs/view-documents/view-documents-dialog.component";

export interface Project {
  materialName: string;
  quantity: number;
  makes: string[];
}

const Project_DATA: Project[] = [
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  }
];

@Component({
  selector: "review",
  templateUrl: "./review.component.html",
  styles: ["../../../../assets/scss/main.scss"]
})
export class ReviewComponent implements OnInit {
  displayedColumns: string[] = ["Material Name", "Quantity", "Makes"];

  dataSource = Project_DATA;

  constructor(public dialog: MatDialog) {}

  openDialog1(): void {
    if (AddCommentDialogComponent) {
      const dialogRef = this.dialog.open(AddCommentDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }
  openDialog2(): void {
    if (ViewDocumentsDialogComponent) {
      const dialogRef = this.dialog.open(ViewDocumentsDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }

  ngOnInit() {}
}
