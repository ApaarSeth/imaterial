import { Component, Inject, OnInit } from "@angular/core";
import { ReleaseNotes } from "../../models/release-notes";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "release-notes-dialog",
  templateUrl: "release-notes.component.html"
})

export class ReleaseNoteComponent implements OnInit {

  // notes : ReleaseNotes = {
  //   headerText : 'Material Manager 1.1 has released!',  
  //   description : 'We have updates you can use In our constant endeavor to provide best user experiences we have made changes and improvements to our product across different modules',
  //   releaseList : [{
  //     releaseHead : 'FIXES & ENHANCEMENTS',
  //     items : [
  //     {
  //       description : "Addition of custom materials in Bill of Materials.",
  //     },
  //     {
  //       description : "Creation of your own material database.",
  //     },
  //      {
  //       description : "Supplier can provide the remarks & upload any documents while submitting the quotes.",
  //     },
  //      {
  //       description : "Budget values against each material in the Bill of Materials.",
  //     },
  //      {
  //       description : "Decimals handling across the system.",
  //     }]
  //   }]

  // }

  notes: ReleaseNotes;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReleaseNotes,
    private dialogRef: MatDialogRef<ReleaseNoteComponent>
  ) { }

  ngOnInit() {
    this.notes = this.data;
  }

  close() {
    this.dialogRef.close('closed');
  }

  openDownloadLink(url) {
    window.open(url, '_blank');
  }
}