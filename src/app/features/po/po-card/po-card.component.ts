import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  ProjectAddress,
  SupplierAddress,
  CardData
} from "src/app/shared/models/PO/po-data";

@Component({
  selector: "app-po-card",
  templateUrl: "./po-card.component.html",
  styleUrls: ["./po-card.component.scss"]
})
export class PoCardComponent implements OnInit {
  @Input("cardData") cardData: CardData;
  constructor(private formBuilder: FormBuilder) {}
  projectDetails: FormGroup;
  @Input("viewMode") viewMode: boolean;

  ngOnInit() {
    this.formInit();
    console.log(this.cardData);
  }
  formInit() {
    this.projectDetails = this.formBuilder.group({
      orderNo: [],
      openingDate: [],
      endDate: ["2029-02-28T18:30:00.000Z"]
    });
  }
  submit() {
    console.log(this.projectDetails.value);
  }

  getData() {
    return this.projectDetails.value;
  }
}
