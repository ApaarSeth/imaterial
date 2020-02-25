import {Pipe, PipeTransform} from "@angular/core";
import {isConstructorDeclaration} from "typescript";
import {POService} from "../services/po/po.service";
import {DataService} from "../services/data.service";
import {API} from "../constants/configuration-constants";

@Pipe({
  name: "numberToWords"
})
export class NumberToWordsPipe implements PipeTransform {
  constructor(private poService: POService) {}
  words = "";
  transform(amount: number, args?: any): any {
    if (amount) {
      let totalAmount = amount.toString().split(".");
      if (totalAmount[1] && totalAmount[1] !== "00") {
        let paise = Number(totalAmount[1].slice(0, 3));
        if (paise > 100) {
          if (paise % 10 >= 5) {
            paise = Math.floor(paise / 10) + 1;
          } else {
            paise = Math.floor(paise / 10);
          }
        }

        return Promise.all([this.poService.getNumberToWords(Number(totalAmount[0])), this.poService.getNumberToWords(paise)]).then(data => {
          console.log(data[0].data);

          return (this.words = data[0].data + " Rupees & " + data[1].data + " Paise");
        });
      } else {
        return this.poService.getNumberToWords(Number(totalAmount[0])).then(data => {
          console.log(data.data + " Rupees");
          this.words = data.data + " Rupees";
          return data.data + " Rupees";
        });
      }
    } else {
      return this.poService.getNumberToWords(0).then(data => {
        this.words = data.data + " Rupees";
        return data.data + " Rupees";
      });
    }
  }
}
