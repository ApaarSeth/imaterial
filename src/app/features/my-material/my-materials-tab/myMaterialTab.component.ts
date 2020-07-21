import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { categoryNestedLevel } from 'src/app/shared/models/category';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditMyMaterialComponent } from 'src/app/shared/dialogs/edit-my-material/edit-my-material.component';
import { CommonService } from 'src/app/shared/services/commonService';
import { MyMaterialService } from 'src/app/shared/services/myMaterial.service';
import { AddMyMaterialBomComponent } from 'src/app/shared/dialogs/add-my-material-Bom/add-my-material-bom.component';

@Component({
	selector: 'app-my-material-tab',
	templateUrl: './myMaterialTab.component.html'
})
export class MyMaterialTabComponent implements OnInit {

	@Input("selectedCategory") selectedCategry: categoryNestedLevel[]
	selectedCategory: categoryNestedLevel[] = [];
	isSearching: boolean;

	constructor(public dialog: MatDialog,
		private snackBar: MatSnackBar, private materialService: MyMaterialService, private commonService: CommonService, private bomService: BomService, private dialogRef: MatDialog) { }

	ngOnInit() {
		// this.getMyMaterial();
		this.commonService.materialAdded.subscribe(val => {
			if (val) {
				this.getMyMaterial();
			}
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.selectedCategry && changes.selectedCategry.currentValue) {
			this.selectedCategory = changes.selectedCategry.currentValue
			this.searchCategory()
		}
	}

	getMyMaterial() {
		this.commonService.getMyMaterial('approved').then(res => {
			this.selectedCategory = [...res.data];
			this.searchCategory();
		});
	}

	openAddMaterial() {
		const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
			width: '720px'
		})
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'done') {
				this.commonService.materialAdded.next(true)
			}
		})
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
	onDelete(c, sc) {
		this.materialService.deleteApi(this.selectedCategory[c].materialList[sc].customMaterialId).then(res => {
			if (res.statusCode = '201') {
				this.snackBar.open("Material Successfully Deleted", "", {
					duration: 4000,
					panelClass: ["warning-snackbar"],
					verticalPosition: "bottom"
				});
				this.selectedCategory[c].materialList.splice(sc, 1)
			}
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
