import {
    Component,
    OnInit,
    Inject,
    ViewChild,
  } from '@angular/core';
import { ProjectService } from '../../shared/services/projectDashboard/project.service';
import {  MatDialog } from '@angular/material';
import { DialogOverviewExampleDialog } from 'src/app/shared/models/add-project/dialog-overview-example-dialog.component';


// export interface DialogData {
//   animal: string;
//   name: string;
// }
  @Component({
    selector: 'dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['../../../assets/scss/main.scss']
  })
  export class DashboardComponent implements OnInit {
    userId : 1;
    value = '';
    animal: string;
    name: string;
    //@ViewChild('dialogOverviewExampleDialog') public dialogOverviewExampleDialog: DialogOverviewExampleDialog;
    constructor(
      private projectService: ProjectService,
      public dialog: MatDialog
    ) {
      //const users: UserData[] = [];
     
    // var users1=[];
    // for (let i = 1; i <= 100; i++) { /*users.push(createNewUser(i));*/
    
    //   users1.push({"cnt" : i,"name":"batr"+i});
      
    //  }

    // Assign the data to the data source for the table to render
   // this.dataSource = new MatTableDataSource(users1);
    }
  
    ngOnInit() {
      this.getProjects();
    }

    //displayedColumns = ['id', 'name', 'progress', 'color'];
    //dataSource: MatTableDataSource<UserData>;

    getProjects(){
      this.projectService.getProjects(1).then(res => {
        res.data;
        console.log("wefrgthyjhgff" +res);
    });
    }

    // modal function
    openDialog(): void {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '700px',
        data: {name: 'asdfgh', animal: 'werty'}
      });
  
      dialogRef.afterClosed().toPromise().then(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }
  }

//  const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
//  const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
  
// function createNewUser(id: number): UserData {
//   const name =
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };
// }



// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }



// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'dialog-overview-example-dialog.html',
// })
// export class DialogOverviewExampleDialog {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }