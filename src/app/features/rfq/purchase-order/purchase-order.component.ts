import { Component, OnInit } from "@angular/core";

export interface PO {
  POName: string;
  createdAt: string;
  totalMaterial: number;
  POAmount: number;
}

const PO_DATA: PO[] = [
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  },
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  },
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  },
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  },
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  },
  {
    POName: "Steel 43 MM",
    createdAt: "20:01:2020",
    totalMaterial: 5,
    POAmount: 45678
  }
];

@Component({
  selector: "purchase-order",
  templateUrl: "./purchase-order.component.html",
  styles: ["../../../../assets/scss/main.scss"]
})
export class PurchaseOrderComponent implements OnInit {
  dataSource = PO_DATA;

  POStatus = ["DRAFTED PO", "AWARDED PO", "ACCEPTED PO", "REJECTED PO"];

  displayedColumns = ["PO Name", "Raised Date", "Total Material", "PO Amount"];

  ngOnInit() {}
}
