import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { MatDialog } from '@angular/material';
import { AddMyMaterialComponent } from 'src/app/shared/dialogs/add-my-material/add-my-material.component';

@Component({
  selector: 'app-my-material',
  templateUrl: './my-material.component.html'
})
export class MyMaterialComponent implements OnInit {

  constructor(private bomService: BomService, public dialog: MatDialog, ) { }
  tradeNames: string[] = [];
  showMyMaterial = true
  showUnapprovedMaterial = false;
  currentIndex: number = 0;
  ngOnInit() {
    this.tradeNames = ['civil', 'piping']
  }
  openAddMaterial() {
    this.dialog.open(AddMyMaterialComponent)
  }

  searchMaterial(event) {
    this.bomService.searchText.next(event);
  }

  tabClick(event) {
    this.currentIndex = event.index;
    let dataPresent: boolean;
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
