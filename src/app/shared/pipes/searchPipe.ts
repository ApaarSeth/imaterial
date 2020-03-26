import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "SearchPipe"
})
export class SearchPipe implements PipeTransform {
  transform(searchList: any[], searchText: string, property?: string, property1?: string): any[] {
    if (searchText && searchList) {
      let newSearchList = new Array<any>();
      searchText = searchText.toLowerCase();
      // when search the array directly
      if (!property) {
        for (let search of searchList) {
          if (search.toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
            newSearchList.push(search);
          }
        }
      } else if (property && !property1) {
        for (let search of searchList) {
          if (search[property] && search[property].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
            newSearchList.push(search);
          }
        }
      } else {
        for (let search of searchList) {
          if (typeof search[property][property1] != 'object') {
            if (search[property][property1] && search[property][property1].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
              newSearchList.push(search);
            }
          }
          for (let prop of search[property][property1]) {

          }
        }
      }

      return newSearchList;
    }

    return searchList;
  }
}
