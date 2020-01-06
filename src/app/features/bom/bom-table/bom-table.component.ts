import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Observable, of } from "rxjs";
import { DataSource } from "@angular/cdk/table";
import { MatTableDataSource } from "@angular/material/table";
import { Data, ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { ProjectDetails } from "src/app/shared/models/project-details";

@Component({
  selector: "app-bom-table",
  templateUrl: "./bom-table.component.html",
  styleUrls: ["./bom-table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class BomTableComponent implements OnInit {
  productId: number;
  product: ProjectDetails;
  subcategoryData: Subcategory[] = [];
  columnsToDisplay = [
    "name",
    "estimatedQuantity",
    "requestedMaterial",
    "issuedToProject",
    "availableInStock"
  ];

  innerDisplayedColumns = [
    "name",
    "estimatedQuantity",
    "requestedMaterial",
    "issuedToProject",
    "availableInStock"
  ];
  dataSource: MatTableDataSource<Subcategory>;
  expandedElement: Subcategory | null;

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params["id"];
    });
    //this.product = history.state.projectDetails;
    this.getProject(this.productId);

    SUBCATEGORIES.forEach(subcategory => {
      if (
        subcategory.materials &&
        Array.isArray(subcategory.materials) &&
        subcategory.materials.length
      ) {
        this.subcategoryData = [
          ...this.subcategoryData,
          {
            ...subcategory,
            materials: new MatTableDataSource(subcategory.materials)
          }
        ];
      } else {
        this.subcategoryData = [...this.subcategoryData, subcategory];
      }
    });
    this.dataSource = new MatTableDataSource(this.subcategoryData);
  }
  toggleRow(element: Subcategory) {
    element.materials &&
    (element.materials as MatTableDataSource<Materials>).data.length
      ? (this.expandedElement =
          this.expandedElement === element ? null : element)
      : null;
    this.cd.detectChanges();
    // this.innerTables.forEach(
    //   (table, index) =>
    //     ((table.dataSource as MatTableDataSource<
    //       Address
    //     >).sort = this.innerSort.toArray()[index])
    // );
  }

  getProject(id: number) {
    this.projectService.getProject(1, id).then(data => {
      this.product = data.message;
    });
  }

  editProject() {}
  deleteProject() {}
  raiseIndent() {
    let projectDetails = this.product;
    this.router.navigate(["/indent/" + this.productId]);
  }
}

export interface Subcategory {
  name: string;
  estimatedQuantity: number;
  requestedMaterial: number;
  issuedToProject: number;
  availableInStock: number;
  materials?: Materials[] | MatTableDataSource<Materials>;
}

export interface Materials {
  name: string;
  estimatedQuantity: number;
  requestedMaterial: number;
  issuedToProject: number;
  availableInStock: number;
}
const SUBCATEGORIES: Subcategory[] = [
  {
    name: "steelbar",
    estimatedQuantity: 1500,
    requestedMaterial: null,
    issuedToProject: null,
    availableInStock: null,
    materials: [
      {
        name: "Steelbar 15mm",
        estimatedQuantity: 1500,
        requestedMaterial: 600,
        issuedToProject: 600,
        availableInStock: 300
      },
      {
        name: "Steelbar 15mm",
        estimatedQuantity: 1500,
        requestedMaterial: 600,
        issuedToProject: 600,
        availableInStock: 300
      }
    ]
  }
];
