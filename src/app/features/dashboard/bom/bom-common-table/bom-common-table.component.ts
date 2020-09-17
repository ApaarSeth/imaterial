import { CommonService } from './../../../../shared/services/commonService';
import { Subcategory } from './../../../../shared/models/subcategory-materials';

import { SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { BomService } from 'src/app/shared/services/bom.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
    selector: 'bom-common-table',
    templateUrl: './bom-common-table.component.html'
})

export class BomCommonTableComponent implements OnInit, OnChanges {

    @Output() updateBomTable = new EventEmitter<any>();
    @Output() updateBomPaginator = new EventEmitter<any>();
    @Input() config: any;
    @Input() selectedMaterialLength: number;
    dataSource = new MatTableDataSource<Subcategory>();

    form: FormGroup;
    materialUnits: string[] = [];
    matData: any;
    isMobile: boolean;
    tableHeads: string[] = [];
    getRangeLabel: any;

    constructor(
        private formBuilder: FormBuilder,
        private bomService: BomService,
        private commonService: CommonService
    ) {
        this.bomService.getMaterialUnit().then(res => {
            this.materialUnits = res.data;
        });
    }

    ngOnInit(): void {
        this.isMobile = this.commonService.isMobile().matches;
        this.dataSource = this.config.data;
        this.matData = this.config.data;
        if (this.config.table) {
            this.getTableHeads();
        }
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
        this.form.get('material').valueChanges.subscribe(val => {
            this.updateBomTable.emit(val);
        });
    }

    setMaterialArr(data) {
        return this.formBuilder.group({
            groupName: [ data.groupName ],
            materialList: this.getTableMaterialConfig(data)
        });
    }

    // set material list group object 

    getTableMaterialConfig(data: any) {
        const mtcrl = new FormArray([]);
        data.materialList.forEach(item => {
            let tableConfig: any = {};
            for (let i in this.config.table.materialList) {
                if (this.config.table.materialList[ i ].formProperty) {
                    tableConfig[ i ] = new FormControl((item[ i ] ? item[ i ] : null));
                }
                tableConfig[ 'isNull' ] = true;
            }
            mtcrl.push(this.formBuilder.group({ ...tableConfig }));
        })
        return mtcrl;
    }

    // check table headings which can be dynamic adjust for each table 

    getTableHeads() {
        let headList = [];
        for (let i in this.config.table.materialList) {
            if (this.config.table.materialList[ i ].visible) {
                headList.push(this.config.table.materialList[ i ].headName);
            }
        }
        this.tableHeads = headList;
    }

    // function to toggle material group child data 

    toggleMaterials(event, attrVal: string) {
        // const dataSetGroup = document.querySelectorAll('tbody[data-trgroup]');
        // dataSetGroup.forEach((item: any) => { item.hidden = true });
        if (event.target.children[ 1 ].children && event.target.children[ 1 ].children[ 0 ].innerText == 'keyboard_arrow_up') {
            event.target.children[ 1 ].children[ 0 ].innerText = 'keyboard_arrow_down';
        } else {
            event.target.children[ 1 ].children[ 0 ].innerText = 'keyboard_arrow_up';
        }
        if (event.target.children[ 1 ].children && event.target.parentNode.nextElementSibling.hidden == false) {
            event.target.parentNode.nextElementSibling.hidden = true;
        } else {
            event.target.parentNode.nextElementSibling.hidden = false;
        }
    }

    // inline table search and storing the data entered by user 

    getSearchData(data) {
        if (data) {
            this.form.value.material.forEach(item => {
                item.materialList.forEach(itm => {
                    if (itm.materialName.toLowerCase().indexOf(data.toLowerCase()) === -1) {
                        itm.isNull = false;
                    } else {
                        itm.isNull = true;
                    }
                });
            });
        } else {
            this.form.value.material.forEach(item => {
                item.materialList.forEach(itm => {
                    itm.isNull = true;
                });
            });
        }
    }

    updatePaginatorOptions(event) {
        this.updateBomPaginator.emit(event);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config) {
            this.dataSource = this.config.data;
            this.matData = this.config.data;
            this.formInit();
        }
    }

}