import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "SearchMaterial"
})
export class SearchMaterialPipe implements PipeTransform {
    transform(searchList: any[], searchText: string, property?: string, property1?: string): any[] {
        if (searchText && searchList) {
            let newSearchList = new Array<any>();
            searchText = searchText.toLowerCase();
            // when search the array directly
            if (property && !property1) {
                searchList = searchList.map(search => {
                    if (search[property].indexOf(searchText.trim().toLowerCase()) > -1) {
                        search.isNull = false;
                    }
                    else {
                        search.isNull = true;
                    }
                    return search;
                })
            } else if (property && property1) {
                for (let search of searchList) {
                    let newMaterialList = search[property].map(list => {
                        if (list[property1].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1)
                            list.isNull = false;
                        else
                            list.isNull = true;
                        return list;
                    })
                    if (newMaterialList.length) {
                        let allNull = newMaterialList.every(list => {
                            return list.isNull === true;
                        })
                        newSearchList.push({ ...search, materialList: newMaterialList, allNull });
                    }

                }
            }
            return searchList;
        }
        return searchList;
    }
}
