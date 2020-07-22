import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CountryCode } from '../../models/currency';
import { CommonService } from '../../services/commonService';
import { PoTableComponent } from 'src/app/features/po/po-table/po-table.component';
import { GrnAddMaterialComponent } from './add-material/add-material.component';
import { GrnMaterialList } from '../../models/add-direct-grn';
import { Supplier } from '../../models/RFQ/rfq-view';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-add-grn',
    templateUrl: 'add-grn.component.html'
})

export class AddGrnComponent implements OnInit {
    @ViewChild("myMaterial", { static: false }) myMaterial: GrnAddMaterialComponent;
    currentIndex: number = 0;
    countryList: CountryCode[] = [];
    materialList: GrnMaterialList[] = [];
    supplierList: Supplier[]
    constructor(private commonService: CommonService,
        private dialogRef: MatDialogRef<AddGrnComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {
        let orgId = Number(localStorage.getItem('orgId'));
        Promise.all([this.commonService.getSuppliers(orgId), this.commonService.getCountry()])
            .then(res => {
                this.supplierList = res[0].data;
                this.countryList = res[1].data;
            })
    }

    selectionChange(event) {
        this.currentIndex = event.selectedIndex;
        if (this.currentIndex === 1) {
            this.materialList = this.myMaterial.getMaterialList()
        }
    }

    cancel() {
        this.dialogRef.close(null)
    }
}