import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { categoryNestedLevel } from 'src/app/shared/models/category';
import { MatDialog } from '@angular/material';
import { EditMyMaterialComponent } from 'src/app/shared/dialogs/edit-my-material/edit-my-material.component';

@Component({
	selector: 'app-my-material-tab',
	templateUrl: './myMaterialTab.component.html'
})
export class MyMaterialTabComponent implements OnInit {
	selectedCategory: categoryNestedLevel[];
	isSearching: boolean;

	constructor(private bomService: BomService, private dialogRef: MatDialog) { }

	ngOnInit() {
		this.bomService.getMyMaterial().then(res => {
			this.selectedCategory = [...res.data];
			this.searchCategory();
		});
	}

	openEditDialog(c, sc) {
		let data = [this.selectedCategory[c].materialList[sc]]
		this.dialogRef.open(EditMyMaterialComponent, {
			width: "1400px",
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
