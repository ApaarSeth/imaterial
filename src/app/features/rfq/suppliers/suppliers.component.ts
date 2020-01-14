import { Component, OnInit } from "@angular/core";

export interface Supplier {
  supplierName: string;
  email: string;
  phoneNumber: number;
  panNumber: number;
}

const SUPPLIER_DATA: Supplier[] = [
  {
    supplierName: "Ravi Supplier Pvt. Ltd.",
    email: "ravi.supplier@gmail.com",
    phoneNumber: 9813893025,
    panNumber: 9813893025
  },
  {
    supplierName: "Ravi Supplier Pvt. Ltd.",
    email: "ravi.supplier@gmail.com",
    phoneNumber: 9813893025,
    panNumber: 9813893025
  },
  {
    supplierName: "Ravi Supplier Pvt. Ltd.",
    email: "ravi.supplier@gmail.com",
    phoneNumber: 9813893025,
    panNumber: 9813893025
  },
  {
    supplierName: "Ravi Supplier Pvt. Ltd.",
    email: "ravi.supplier@gmail.com",
    phoneNumber: 9813893025,
    panNumber: 9813893025
  },
  {
    supplierName: "Ravi Supplier Pvt. Ltd.",
    email: "ravi.supplier@gmail.com",
    phoneNumber: 9813893025,
    panNumber: 9813893025
  }
];

@Component({
  selector: "suppliers",
  templateUrl: "./suppliers.component.html",
  styles: ["../../../../assets/scss/main.scss"]
})
export class SuppliersComponent implements OnInit {
  searchText: string = null;
  buttonName: string = "selectSupplier";

  displayedColumns: string[] = [
    "Supplier Name",
    "Email",
    "Phone No.",
    "PAN No.",
    "customColumn"
  ];

  dataSource = SUPPLIER_DATA;

  ngOnInit() {}
}
