import {
    Component,
    OnInit,
    Inject,
    ViewChild,
  } from '@angular/core';
import { ProjectService } from '../../shared/services/projectDashboard/project.service';
import {  MatDialog } from '@angular/material';
import { AddProjectComponent } from 'src/app/shared/dialogs/add-project/add-project.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectDetails, ProjetPopupData } from 'src/app/shared/models/project-details';


// export interface DialogData {
//   animal: string;
//   name: string;
// }
  @Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/scss/main.scss']
  })
  export class DashboardComponent implements OnInit {
    userId : 1;
    value = '';
    animal: string;
    name: string;

    allProjects: ProjectDetails[];

    constructor(
      private projectService: ProjectService,
      public dialog: MatDialog,
      private activatedRoute: ActivatedRoute  
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
      // this.getProjects();
      this.allProjects = this.activatedRoute.snapshot.data.dashBoardData
    }

    //displayedColumns = ['id', 'name', 'progress', 'color'];
    //dataSource: MatTableDataSource<UserData>;

    getProjects(){
      this.projectService.getProjects(1).then(res => {
        res.data;
        console.log("wefrgthyjhgff" +res);
    });
    }


    editProject(projectId: number){
      console.log(projectId);

      const data: ProjetPopupData = {
        isEdit:true,
        detail:this.allProjects.find(pro => pro.projectId === projectId)
      }

      this.openDialog(data);

    }

    addProject(){

      this.openDialog({
        isEdit:false,
      } as ProjetPopupData);


    }


    // modal function
    openDialog(data:ProjetPopupData ): void {
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: '700px',
        data 
      });
  
      dialogRef.afterClosed().toPromise().then(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }
  }
