import { MatDialog } from '@angular/material/dialog';
import { Injectable } from "@angular/core";
import { ProjetPopupData } from "../models/project-details";
import { AddProjectComponent } from "../dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../dialogs/double-confirmation/double-confirmation.component";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class AddProjectService {
    constructor(private dialog: MatDialog) { }

    onEditOrDelete = new Subject<string>()

    openDialog(data: ProjetPopupData): void {
        if (data.isDelete == false) {
            const dialogRef = this.dialog.open(AddProjectComponent, {
                width: "1200px",
                data,
                panelClass: ['common-modal-style', 'add-project-dialog']
            });
            dialogRef
                .afterClosed()
                .toPromise()
                .then(result => {
                    if (result && result != null) {
                        this.onEditOrDelete.next(result)
                    }
                })
        } else if (data.isDelete == true) {
            const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
                width: "500px",
                data
            });
            dialogRef
                .afterClosed()
                .toPromise()
                .then(result => {
                    if (result && result != null) {
                        this.onEditOrDelete.next(result)
                    }
                });
        }
    }
}
