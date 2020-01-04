import {
    Component,
    OnInit,
    Inject,
    ViewChild,
  } from '@angular/core';
//import { ProjectService } from '../../shared/services/projectDashboard/project.service';
//import {  MatDialog } from '@angular/material';
//import { AddProjectComponent } from 'src/app/shared/dialogs/add-project/add-project.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectDetails, ProjetPopupData } from 'src/app/shared/models/project-details';
//import { DoubleConfirmationComponent } from 'src/app/shared/dialogs/double-confirmation/double-confirmation.component';


export interface PeriodicElement {
  materialName: string;
  estimatedQty: number;
  requiredQty: number;
  requiredDate: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 1.0079, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 4.0026, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 6.941, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 9.0122, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 10.811, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 12.0107, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 14.0067, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 15.9994, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM', estimatedQty: 200, requiredQty: 18.9984, requiredDate: 22/2/2020},
  {materialName: 'Steelbar 15MM',estimatedQty: 200, requiredQty: 20.1797, requiredDate: 22/2/2020},
];
  @Component({
    selector: 'dashboard',
    templateUrl: './indent-dashboard.component.html',
    styleUrls: ['../../../assets/scss/main.scss']
  })
  export class IndentDashboardComponent implements OnInit {
    userId : 1;
    searchText: string = null;
    projectId: number;
    product: any;
    displayedColumns: string[] = ['Material Name', 'Estimated Quantity', 'Required Quantity', 'Required Date'];
    dataSource = ELEMENT_DATA;

    constructor(
      //private projectService: ProjectService,
      //public dialog: MatDialog,
      private activatedRoute: ActivatedRoute  
    ) {}
  
    ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        this.projectId = params["id"];
      });
      this.product = history.state.projectDetails;
    }

    editProject(projectId: number){}
    deleteProject(){}

    // editProject(projectId: number){
    //   console.log(projectId);

    //   const data: ProjetPopupData = {
    //     isEdit:true,
    //     isDelete:false,
    //     detail:this.allProjects.find(pro => pro.projectId === projectId)
    //   }

    //   this.openDialog(data);

    // }

    // addProject(){

    //   this.openDialog({
    //     isEdit:false,
    //     isDelete:false,
    //   } as ProjetPopupData);


    // }

    // deleteProject(projectId: number){

    //   const data: ProjetPopupData = {
    //     isEdit:false,
    //     isDelete:true,
    //     detail:this.allProjects.find(pro => pro.projectId === projectId)
    //   }

    //   this.openDialog(data);


    // }


    // modal function
    // openDialog(data:ProjetPopupData ): void {
    //   if(data.isDelete == false){
    //   const dialogRef = this.dialog.open(AddProjectComponent, {
    //     width: '700px',
    //     data 
    //   });
  
    //   dialogRef.afterClosed().toPromise().then(result => {
    //   });
    // }else if(data.isDelete == true){
    //   const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
    //     width: '500px',
    //     data 
    //   });
  
    //   dialogRef.afterClosed().toPromise().then(result => {
    //   });
    // }


    // }
  }
