import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { BomService } from 'src/app/shared/services/bom.service';
import { Subcategory } from './../../models/subcategory-materials';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'bom-common-table',
    templateUrl: './bom-common-table.component.html'
})

export class BomCommonTableComponent implements OnInit {

    @Input() config: any;
    dataSource = new MatTableDataSource<Subcategory>();

    form: FormGroup;
    materialUnits: string[] = [];
    matData: any;
    isMobile: boolean;
    tableHeads: string[] = [];
    getRangeLabel: any;


    constructor(
        private formBuilder: FormBuilder,
        private bomService: BomService
    ) {
        this.bomService.getMaterialUnit().then(res => {
            this.materialUnits = res.data;
        });
    }

    ngOnInit(): void {
        this.dataSource = this.config.data;
        this.matData = this.config.data;
        if (this.config.table) {
            this.getTableHeads();
        }
        this.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 of ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} – ${endIndex} of ${length}`; }
        this.formInit();
    }

    formInit() {
        const matCtrl = new FormArray([]);
        this.matData.forEach(mat => {
            matCtrl.push(this.setMaterialArr(mat));
        })
        this.form = this.formBuilder.group({
            material: matCtrl
        })
        console.log(matCtrl);
        // this.form.valueChanges.subscribe(data => {
        //     console.log(data);
        // });
    }

    setMaterialArr(data) {
        return this.formBuilder.group({
            groupName: [ data.groupName ],
            materialList: this.getTableMaterialConfig(data)
        });
    }

    getTableMaterialConfig(data: any) {
        const mtcrl = new FormArray([]);
        data.materialList.forEach(item => {
            let tableConfig: any = {};
            for (let i in this.config.table.materialList) {
                if (this.config.table.materialList[ i ].formProperty) {
                    tableConfig[ i ] = new FormControl((item[ i ] ? item[ i ] : null));
                }
            }
            mtcrl.push(this.formBuilder.group({ ...tableConfig }));
        })
        return mtcrl;
    }

    getTableHeads() {
        let headList = [];
        for (let i in this.config.table.materialList) {
            if (this.config.table.materialList[ i ].visible) {
                headList.push(this.config.table.materialList[ i ].headName);
            }
        }
        this.tableHeads = headList;
    }

    toggleMaterials(event, attrVal: string) {
        // const dataSetGroup = document.querySelectorAll('tbody[data-trgroup]');
        // dataSetGroup.forEach((item: any) => { item.hidden = true });
        if (event.target.children[ 1 ].children[ 0 ].innerText == 'keyboard_arrow_up') {
            event.target.children[ 1 ].children[ 0 ].innerText = 'keyboard_arrow_down';
        } else {
            event.target.children[ 1 ].children[ 0 ].innerText = 'keyboard_arrow_up';
        }
        if (event.target.parentNode.nextElementSibling.hidden == false) {
            event.target.parentNode.nextElementSibling.hidden = true;
        } else {
            event.target.parentNode.nextElementSibling.hidden = false;
        }
    }

    getData(data) {
        console.log(data);
    }

}