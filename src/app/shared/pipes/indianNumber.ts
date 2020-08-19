import { Pipe, PipeTransform } from "@angular/core";
import { isConstructorDeclaration } from "typescript";
import { POService } from "../services/po.service";
import { DataService } from "../services/data.service";
import { API } from "../constants/configuration-constants";

@Pipe({
    name: "indianNumber"
})
export class IndianNumberPipe implements PipeTransform {
    constructor() { }
    transform(amount: number, args?: any): any {
        let tempAmt = amount.toLocaleString(args)
        if (tempAmt.includes('.')) {
            let decimalNumber = tempAmt.slice(tempAmt.indexOf('.') + 1, tempAmt.length);
            if (decimalNumber.length >= 2) {
                decimalNumber.slice(0, decimalNumber.length)
                return `${tempAmt.slice(0, tempAmt.indexOf('.'))}.${decimalNumber.slice(0, 2)}`
            }
            else if (decimalNumber.length == 1) {
                return `${tempAmt.slice(0, tempAmt.indexOf('.'))}.${decimalNumber.slice(0, decimalNumber.length)}0`
            }
        }
        else {
            return tempAmt
        }
    }
}
