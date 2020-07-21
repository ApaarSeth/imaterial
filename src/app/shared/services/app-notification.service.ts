import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: "root" })
export class AppNotificationService {

    constructor(private _snackBar: MatSnackBar) {
    }

    snack(msg: string) {
        this._snackBar.open(msg, "", {
            duration: 2 * 1000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
        });
    }
}
