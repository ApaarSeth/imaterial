import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChild
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

@Component({
  selector: "card-layout",
  templateUrl: "project-item.component.html"
})
export class ProjectItemComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  @Output("onEdit") onEdit = new EventEmitter<number>();
  @Output("onDelete") onDelete = new EventEmitter<number>();
  @Input("projectDetails") projectDetails: ProjectDetails;
  ngOnInit(): void {}

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
}
