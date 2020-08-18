import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { categoryNestedLevel } from 'src/app/shared/models/category';
import { MatDialog } from '@angular/material/dialog';
import { EditMyMaterialComponent } from 'src/app/shared/dialogs/edit-my-material/edit-my-material.component';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
    selector: 'app-unapproved-material-tab',
    templateUrl: './unapprovedMaterialTab.component.html'
})
export class UnapprovedMaterialTabComponent implements OnInit {
    selectedCategory: categoryNestedLevel[];
    isSearching: boolean;

    constructor(private commonService: CommonService, private bomService: BomService, private dialogRef: MatDialog) { }

    ngOnInit() {
        this.commonService.getMyMaterial('unapproved').then(res => {
            this.selectedCategory = [...res.data];
            this.searchCategory();
        });
    }

    openEditDialog(c, sc) {
        let data = { materialList: [this.selectedCategory[c].materialList[sc]], type: 'add' }
        this.dialogRef.open(EditMyMaterialComponent, {
            width: "750px",
            data
        })
    }

    searchCategory() {
        this.bomService.searchText.subscribe(val => {
            if (val && val !== '') {
                this.isSearching = true;
                for (let category of this.selectedCategory) {
                    for (let mat of category.materialList) {
                        if (mat.materialName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1) {
                            mat.isNull = false;
                        }
                        else {
                            mat.isNull = true;
                        }
                    }
                    category.allNull = category.materialList.every(mat => mat.isNull)
                }
            }
            else {
                this.isSearching = false;
                for (let category of this.selectedCategory) {
                    for (let mat of category.materialList) {
                        mat.isNull = false;
                    }
                    category.allNull = false;
                }
            }
        })
    }
}
