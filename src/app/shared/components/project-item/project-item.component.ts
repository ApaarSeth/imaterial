import { AddProjectService } from './../../services/add-project.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from "@angular/core";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { PermissionService } from "../../services/permission.service";
import { DisplayProjectDetailsComponent } from "../../dialogs/display-project-details/display-project-details.component";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from '../../services/commonService';
import { AddProjectComponent } from "../../dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../dialogs/double-confirmation/double-confirmation.component";
import { Router } from '@angular/router';
import { ProjectService } from "../../services/project.service";

@Component({
  selector: "card-layout",
  templateUrl: "project-item.component.html"
})
export class ProjectItemComponent implements OnInit {
  id: number;
  permissionObj: any;
  url: string;
  currencyCode: string;
  isMobile: boolean;

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService,
    private addProjectService: AddProjectService
  ) { }

  @Output('startDate') startDate = new EventEmitter<Date>();
  @Output("onEditOrDelete") onEditOrDelete = new EventEmitter<string>();
  @Input("projectDetails") projectDetails: ProjectDetails;
  @Input("disableEditDelete") disableEditDelete: boolean;
  @Input('pageType') type: string;

  ngOnInit(): void {
    this.isMobile = this.commonService.isMobile().matches;
    this.currencyCode = localStorage.getItem('currencyCode');
    const role = localStorage.getItem("role")
    this.permissionObj = this.permissionService.checkPermission(role);
    if (this.projectDetails.startDate) {
      this.startDate.emit(this.projectDetails.startDate);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.url = this.router.url;

  }

  edit(proId: number, $event) {
    // this.onEdit.emit(proId);
    // $event.stopPropagation();
    this.editProject()
  }

  delete(proId: number, $event) {
    // this.onDelete.emit(proId);
    // $event.stopPropagation();
    this.deleteProject()
  }

  navigationToBOM(id: number, projectDetails: ProjectDetails) {
    if (projectDetails.matCount > 0) {
      this.router.navigate([ "/project-dashboard/bom/" + id + "/bom-detail" ]);
    } else {
      this.router.navigate([ "/project-dashboard/bom/" + id ], { state: { projectDetails } });
    }
  }

  redirectToPurchaseOrder() {
    this.router.navigate([ "po" ]);
  }
  redirectToOpenIndentCount(id: number, projectDetails: ProjectDetails) {
    this.router.navigate([ "/indent/" + id + "/indent-detail" ]);
    // this.router.navigate(['/indent/1/indent-detail']);
  }

  showDetails(data): void {
    const dialogRef = this.dialog.open(DisplayProjectDetailsComponent, {
      maxWidth: '80vw',
      data
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => result);
  }

  editProject() {
    const data: ProjetPopupData = {
      isEdit: true,
      isDelete: false,
      detail: this.projectDetails
    };
    this.addProjectService.openDialog(data);
  }

  deleteProject() {
    const data: ProjetPopupData = {
      isEdit: false,
      isDelete: true,
      detail: this.projectDetails
    };
    this.addProjectService.openDialog(data);
  }

  openDialog(data: ProjetPopupData): void {
    if (data.isDelete == false) {
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: "1200px",
        data,
        panelClass: [ 'common-modal-style', 'add-project-dialog' ]
      });
      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          if (result && result != null) {
            this.onEditOrDelete.next('edit')
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
            this.onEditOrDelete.next('delete')
          }
        });
    }
  }
}
