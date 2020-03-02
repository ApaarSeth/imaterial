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

@Component({
  selector: "card-layout",
  templateUrl: "project-item.component.html"
})
export class ProjectItemComponent implements OnInit {
  id: number;
  permissionObj: any;
  url: string;

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
     private guidedTourService: GuidedTourService
  ) {}

  @Output("onEdit") onEdit = new EventEmitter<number>();
  @Output("onDelete") onDelete = new EventEmitter<number>();
  @Input("projectDetails") projectDetails: ProjectDetails;
  @Input("disableEditDelete") disableEditDelete: boolean;

  ngOnInit(): void {
    this.permissionObj = this.permissionService.checkPermission();
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
      this.router.navigate(["/bom/" + id + "/bom-detail"]);
    } else {
      this.router.navigate(["/bom/" + id], { state: { projectDetails } });
    }
  }

  redirectToPurchaseOrder() {
    this.router.navigate(["po/detail-list"]);
  }
  redirectToOpenIndentCount(id: number, projectDetails: ProjectDetails) {
    this.router.navigate(["/indent/" + id + "/indent-detail"]);
    // this.router.navigate(['/indent/1/indent-detail']);
  }
}
