import { material } from './../../models/category';
import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { BomService } from 'src/app/shared/services/bom.service';
import { Subcategory } from './../../models/subcategory-materials';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bom-common-table',
    templateUrl: './bom-common-table.component.html'
})

export class BomCommonTableComponent implements OnInit, OnChanges {

    @Output() updateBomTable = new EventEmitter<any>();
    @Output() updateBomPaginator = new EventEmitter<any>();
    @Input() config: any;
    dataSource = new MatTableDataSource<Subcategory>();

    form: FormGroup;
    materialUnits: string[] = [];
    matData: any;
    isMobile: boolean;
    tableHeads: string[] = [];
    getRangeLabel: any;
    searchText: string = '';

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
        this.form.setValidators(this.checkFormValidation);
        this.form.valueChanges.subscribe(val => {
            this.updateBomTable.emit(this.form);
        });
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
            let commonValidation = new FormArray([]);
            for (let i in this.config.table.materialList) {
                let vGroup: any = {};
                if (this.config.table.materialList[ i ].formProperty) {
                    tableConfig[ i ] = new FormControl((item[ i ] ? item[ i ] : null));
                }
                tableConfig[ 'isNull' ] = true;
                if (this.config.table.materialList[ i ].any) {
                    vGroup[ i ] = new FormControl(i);
                }
                if (Object.keys(vGroup).length) {
                    commonValidation.push(this.formBuilder.group({ ...vGroup }));
                }
                tableConfig[ 'commonValidation' ] = commonValidation;
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

    checkFormValidation(form) {
        let result = false;
        form.value.material.forEach(item => {
            item.materialList.forEach(itm => {
                if (itm.commonValidation && itm.commonValidation.length) {
                    let vals = [];
                    itm.commonValidation.forEach(key => {
                        for (let i in itm) {
                            if (key[ i ] && key[ i ] == i) {
                                if (itm[ i ]) vals.push(itm[ i ])
                            }
                        }
                    });
                    if (vals.length === itm.commonValidation.length) {
                        result = true;
                    }
                }
            });
        })
        return result ? null : { result };
    }

}