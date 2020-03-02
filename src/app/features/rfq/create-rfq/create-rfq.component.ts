import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewChildren
} from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import {
  RfqMaterialResponse,
  AddRFQ,
  RfqMat
} from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqQuantityMakesComponent } from "./rfq-quantity-makes/rfq-quantity-makes.component";
import { RfqSupplierComponent } from "./rfq-supplier/rfq-supplier.component";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})
export class CreateRfqComponent implements OnInit {
  @ViewChild("stepper", { static: true, read: MatStepper }) stepper: MatStepper;
  @ViewChild("rfqQtyMakes", { static: true })
  rfqQtyMakes: RfqQuantityMakesComponent;
  @ViewChild("rfqSupplier", { static: true }) rfqSupplier: RfqSupplierComponent;
  qtyMakes: RfqQuantityMakesComponent;
  updatedRfqMaterial: AddRFQ;
  rfqMaterial: AddRFQ;
  stpForm: any;
  prevIndex: any;
  currentIndex = 0;
  rfqData: AddRFQ;
  finalRfq: AddRFQ;
  completed: boolean = false;

     public RfqProjectTour: GuidedTour = {
        tourId: 'rfq-project-tour',
        useOrb: false,
        
        steps: [
            {
              title:'Search Project',
              selector: '.select-project',
              content: 'Select one/multiple projects to add material in the RFQ.',
              orientation: Orientation.Left
            }
        ]
    };

 public RfqSupplierTour: GuidedTour = {
        tourId: 'rfq-supplier-tour',
        useOrb: false,
        
        steps: [
             {
              title:'Add Supplier',
              selector: '.add-supplier-btn',
              content: 'Add supplier to whom RFQ needs to be floated.',
              orientation: Orientation.Left
            }
        ]
    };
  constructor(
    private rfqService: RFQService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
     private guidedTourService: GuidedTourService
  ) { 
     
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.stepper) {
        this.stepper.selectedIndex = params.selectedIndex - 1;

         setTimeout(() => {
            this.guidedTourService.startTour(this.RfqProjectTour);
        }, 1000);


        if (history.state.rfqData) {
          this.rfqMaterial = history.state.rfqData.data;
        }
      }
    });
  }

  getQuantityAndMakes(updatedMaterials: AddRFQ) {
    this.rfqMaterial = updatedMaterials;
    this.completed = this.rfqQtyMakes.materialForms.value.forms.every(
      rfqQty => {
        return rfqQty.quantity != null;
      }
    );
  }

  getMaterial(materials: AddRFQ) {
    this.rfqMaterial = materials;
  }
  selectionChange(event) {
    this.currentIndex = event.selectedIndex;
    this.prevIndex = event.previouslySelectedIndex;
    if (event.previouslySelectedIndex === 1 && event.selectedIndex === 0) {
      
       setTimeout(() => {
            this.guidedTourService.startTour(this.RfqProjectTour);
        }, 1000);

      this.rfqService.addRFQ(this.rfqMaterial).then(res => {
        this.rfqData = res.data;;
      });
    }
    if (event.previouslySelectedIndex === 0 && event.selectedIndex === 1) {

      this.completed = false;
      this.rfqService.addRFQ(this.rfqMaterial).then(res => {
        this.rfqMaterial = res.data;
        this.completed = this.rfqQtyMakes.materialForms.value.forms.every(
          rfqQty => {
            return rfqQty.quantity != null && rfqQty.quantity > 0;
          }
        );
      });
    } else if (
      event.selectedIndex === 2 &&
      event.previouslySelectedIndex === 1
    ) {

       setTimeout(() => {
            this.guidedTourService.startTour(this.RfqSupplierTour);
        }, 1000);



      this.rfqService.addRFQ(this.rfqMaterial).then(res => {
        console.log("res.data", res.data);
        this.finalRfq = res.data;
        // this.rfqMaterial = res.data;
      });
    } else if (event.previouslySelectedIndex == 2) {
      this.rfqService.addRFQ(this.updatedRfqMaterial).then(res => {
        this.currentIndex = event.selectedIndex;
        this.rfqMaterial = res.data;
      });
    }
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  reviewRfq() {
    this.rfqSupplier.navigateToUploadPage();
  }

  checkSupplStatus() {
    return this.rfqSupplier.supplierForm.value.some(supplier => {
      return supplier != null;
    });
  }
}
