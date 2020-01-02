import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'SearchPipe'
})
export class SearchPipe implements PipeTransform {
    transform(searchList: any[], searchText: string, property?: string): any[] {

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
            } else {
                for (let search of searchList) {
                    if (search[property] && search[property].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1) {
                        newSearchList.push(search);
                    }
                }
            }

            return newSearchList;
        }

        return searchList;
    }


}