import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { MatDialog } from '@angular/material';
import { AddMyMaterialComponent } from 'src/app/shared/dialogs/add-my-material/add-my-material.component';
import { Subject } from 'rxjs';
import { CommonService } from '../../shared/services/commonService';

@Component({
  selector: 'app-my-material',
  templateUrl: './my-material.component.html'
})
export class MyMaterialComponent implements OnInit {

  constructor(private bomService: BomService, public dialog: MatDialog, private commonService: CommonService) { }
  tradeNames: string[] = [];
  showMyMaterial = true
  showUnapprovedMaterial = false;
  currentIndex: number = 0;

  ngOnInit() {
    this.tradeNames = ['civil', 'piping']
  }
  openAddMaterial() {
    const dialogRef = this.dialog.open(AddMyMaterialComponent, {
      width: '700px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.commonService.materialAdded.next(true)
      }
    })
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
