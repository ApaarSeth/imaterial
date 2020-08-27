import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../shared/services/commonService';
import { AddMyMaterialBomComponent } from 'src/app/shared/dialogs/add-my-material-Bom/add-my-material-bom.component';
import { categoryNestedLevel } from 'src/app/shared/models/category';

@Component({
  selector: 'app-my-material',
  templateUrl: './my-material.component.html'
})

export class MyMaterialComponent implements OnInit {

  tradeNames: string[] = [];
  showMyMaterial = true
  showUnapprovedMaterial = false;
  currentIndex: number = 0;
  selectedCategory: categoryNestedLevel[] = [];

  constructor(
    private bomService: BomService, 
    public dialog: MatDialog, 
    private commonService: CommonService) { }

  ngOnInit() {
    this.tradeNames = ['civil', 'piping']
    this.getMyMaterial();
  }

  openAddMaterial() {
    const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
      width: '720px',
      panelClass: 'add-custom-material'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'done') {
        this.getMyMaterial()
      }
    })
  }

  searchMaterial(event) {
    this.bomService.searchText.next(event);
  }

  getMyMaterial() {
    this.commonService.getMyMaterial('approved').then(res => {
      this.selectedCategory = [...res.data];
    });
  }

  tabClick(event) {
    this.currentIndex = event.index;
    if (this.currentIndex == 0) {
      this.showMyMaterial = true;
      this.showUnapprovedMaterial = false;
    }
    else {
      this.showUnapprovedMaterial = true;
      this.showMyMaterial = false;
    }
  }
}