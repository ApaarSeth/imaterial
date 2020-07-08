import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "SearchPipe"
})
export class SearchPipe implements PipeTransform {
  transform(searchList: any[], searchText: string, properties?: string[]): any[] {
    if (!searchList) return [];
    if (!searchText) return searchList;
    if (searchText && searchList) {
      // let newSearchList = new Array<any>();
      searchText = searchText.toLowerCase();
      // when search the array directly
      return searchList.filter(item => {
        var itemFound: Boolean;
        if (!properties) {
          return item.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        }
        else {
          for (let i = 0; i < properties.length; i++) {
            if (properties[i].includes(".")) {
              let propArr: string[] = properties[i].split(".")
              if (item[propArr[0]][propArr[1]].toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                itemFound = true;
                break;
              }
            }
            else if (item[properties[i]].toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
              itemFound = true;
              break;
            }
          }
        }
        return itemFound;
      });

      //   if (!property) {
      //     for (let search of searchList) {
      //       if (search.toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
      //         newSearchList.push(search);
      //       }
      //     }
      //   } else if (property && !property1) {
      //     for (let search of searchList) {
      //       if (search[property] && search[property].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
      //         newSearchList.push(search);
      //       }
      //     }
      //   } else {
      //     for (let search of searchList) {
      //       if (typeof search[property][property1] != 'object') {
      //         if (search[property][property1] && search[property][property1].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
      //           newSearchList.push(search);
      //         }
      //       }
      //       for (let prop of search[property][property1]) {

      //       }
      //     }
      //   }

      //   if (newSearchList.length) {
      //     return newSearchList;
      //   } else {
      //     return searchList;
      //   }
      // }

      // return searchList;
    }
  }
}
