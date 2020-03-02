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
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqQuantityMakesComponent } from "./rfq-quantity-makes/rfq-quantity-makes.component";
import { RfqSupplierComponent } from "./rfq-supplier/rfq-supplier.component";
import { AddRFQConfirmationComponent } from 'src/app/shared/dialogs/add-rfq-confirmation/add-rfq-double-confirmation.component';

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
  constructor(
    private router: Router,
    private rfqService: RFQService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    if (this.stepper) {
      this.stepper.selectedIndex = history.state.selectedIndex;
      if (history.state.rfqData) {
        this.rfqMaterial = history.state.rfqData.data;
      }
    }

    // this.route.params.subscribe(params => {
    //   if (this.stepper) {
    //     this.stepper.selectedIndex = params.selectedIndex - 1;
    //     if (history.state.rfqData) {
    //       this.rfqMaterial = history.state.rfqData.data;
    //     }
    //   }
    // });
  }

  getSupplierData(updatedRfq: AddRFQ) {
    this.rfqMaterial = updatedRfq
  }

  getQuantityAndMakes(updatedMaterials: AddRFQ) {
    this.rfqService.addRFQ(updatedMaterials).then((res) => {
      console.log("res.data", res.data);
      this.finalRfq = res.data as AddRFQ
      this.rfqData = res.data as AddRFQ
    });
    this.completed = this.rfqQtyMakes.materialForms.value.forms.every(
      rfqQty => {
        return rfqQty.quantity != null;
      }
    );
  }

  getMaterial(materials: AddRFQ) {
    this.rfqService.addRFQ(materials).then(res => {
      this.route.params.subscribe(param => {
        let rfqId = param['rfqId']
        this.rfqMaterial = res.data as AddRFQ;
        if (!rfqId) {
          this.router.navigate(["/rfq/createRfq", res.data.rfqId], {

            state: { rfqData: res, selectedIndex: 1 }
          });
        }
      })
    });
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  reviewRfq() {
    this.rfqSupplier.reviewRfq();
  }

  checkSupplStatus() {
    return this.rfqSupplier.supplierForm.value.some(supplier => {
      return supplier != null;
    });
  }


}
