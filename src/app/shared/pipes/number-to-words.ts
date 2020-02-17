import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberToWords"
})
export class NumberToWordsPipe implements PipeTransform {
  value = 0;
  words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];
  op;

  transform(amount: any, args?: any): any {
    amount = amount.toString();
    var atemp = amount.split(".");
    var wholeNum = atemp[0].split(",").join("");
    var frac = atemp[1].split(",").join("");
    var whole = this.toWord(wholeNum);
    var fraction = this.toWord(frac);
    if (whole == "" && fraction == "") {
      this.op = "Zero only";
    }
    if (whole == "" && fraction != "") {
      this.op = "paise " + fraction + " only";
    }
    if (whole != "" && fraction == "") {
      this.op = "Rupees " + whole + " only";
    }
    if (whole != "" && fraction != "") {
      this.op = "Rupees " + whole + "and paise " + fraction + " only";
    }
    if (amount > 999999999.99) {
      this.op = "Oops!!! The amount is too big to convert";
    }
    if (isNaN(amount) == true) {
      this.op =
        "Error : Amount in number appears to be incorrect. Please Check.";
    }
    return this.op;
  }

  toWord(num) {
    var n_length = num.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = num.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + Number(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          this.value = n_array[i] * 10;
        } else {
          this.value = n_array[i];
        }
        if (this.value != 0) {
          words_string += this.words[this.value] + " ";
        }
        if (
          (i == 1 && this.value != 0) ||
          (i == 0 && this.value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Crores ";
        }
        if (
          (i == 3 && this.value != 0) ||
          (i == 2 && this.value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Lakhs ";
        }
        if (
          (i == 5 && this.value != 0) ||
          (i == 4 && this.value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Thousand ";
        }
        if (
          i == 6 &&
          this.value != 0 &&
          n_array[i + 1] != 0 &&
          n_array[i + 2] != 0
        ) {
          words_string += "Hundred and ";
        } else if (i == 6 && this.value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split(" ").join(" ");
      return words_string;
    }
  }
}
