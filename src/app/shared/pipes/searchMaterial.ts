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
            if (!property) {
                for (let search of searchList) {
                    if (search.indexOf(searchText.trim().toLowerCase()) > -1) {
                        newSearchList.push(search);
                    }
                }
            } else if (property && property1) {
                for (let search of searchList) {
                    let newMaterialList = search[property].filter(list => {
                        return list[property1].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1
                    })
                    newSearchList.push({ ...search, materialList: newMaterialList });
                }
            }

            return newSearchList;
        }

        return searchList;
    }
}
