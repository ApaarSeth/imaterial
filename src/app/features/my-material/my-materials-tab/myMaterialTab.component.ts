import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { categoryNestedLevel } from 'src/app/shared/models/category';
import { MatDialog } from '@angular/material';
import { EditMyMaterialComponent } from 'src/app/shared/dialogs/edit-my-material/edit-my-material.component';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
	selector: 'app-my-material-tab',
	templateUrl: './myMaterialTab.component.html'
})
export class MyMaterialTabComponent implements OnInit {
	selectedCategory: categoryNestedLevel[];
	isSearching: boolean;

	constructor(private commonService: CommonService, private bomService: BomService, private dialogRef: MatDialog) { }

	ngOnInit() {
		this.getMyMaterial();

		this.commonService.materialAdded.subscribe(val => {
			if (val) {
				this.getMyMaterial();
			}
		})
	}

	getMyMaterial() {
		this.commonService.getMyMaterial('approved').then(res => {
			this.selectedCategory = [...res.data];
			this.searchCategory();
		});
	}


	openEditDialog(c, sc) {
		let data = { materialList: [this.selectedCategory[c].materialList[sc]], type: 'edit' }
		const dialogRef = this.dialogRef.open(EditMyMaterialComponent, {
			width: "750px",
			data
		})
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'done') {
				this.getMyMaterial()
			}
		})
	}
	onDelete(i) {
		this.selectedCategory.splice(i, 1)
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
