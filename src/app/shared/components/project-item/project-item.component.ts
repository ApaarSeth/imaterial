import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChild,
  SimpleChanges
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ProjectDetails } from "../../models/project-details";
import { PermissionService } from "../../services/permission.service";
import { Orientation, GuidedTour, GuidedTourService } from 'ngx-guided-tour';
import { DisplayProjectDetailsComponent } from "../../dialogs/display-project-details/display-project-details.component";
import { MatDialog } from "@angular/material";
import { CommonService } from '../../services/commonService';

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

    private activatedRoute: ActivatedRoute,
    private guidedTourService: GuidedTourService,
    private commonService: CommonService
  ) { }

  @Output("onEdit") onEdit = new EventEmitter<number>();
  @Output("onDelete") onDelete = new EventEmitter<number>();
  @Input("projectDetails") projectDetails: ProjectDetails;
  @Input("disableEditDelete") disableEditDelete: boolean;
  // tslint:disable-next-line: no-output-rename
  @Output('startDate') startDate = new EventEmitter<Date>();

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
    this.onEdit.emit(proId);
    $event.stopPropagation();
  }

  delete(proId: number, $event) {
    this.onDelete.emit(proId);
    $event.stopPropagation();
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
      data
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => result);
  }
}
