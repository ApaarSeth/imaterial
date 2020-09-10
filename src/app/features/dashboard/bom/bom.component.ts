import { Subscription } from 'rxjs';
import { AddBomWarningComponent } from './../../../shared/dialogs/add-bom-warning/add-bom-warning.component';
import { MatDialog } from '@angular/material/dialog';
import { AddMyMaterialBomComponent } from './../../../shared/dialogs/add-my-material-Bom/add-my-material-bom.component';
import { formatDate } from '@angular/common';
import { PaginatorConfig } from './../../../shared/models/common.models';
import { material } from './../../../shared/models/category';
import { AppNavigationService } from './../../../shared/services/navigation.service';
import { FacebookPixelService } from './../../../shared/services/fb-pixel.service';

import { SnackbarComponent } from './../../../shared/dialogs/snackbar/snackbar.compnent';
import { Router } from '@angular/router';
import { GlobalLoaderService } from './../../../shared/services/global-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/services/commonService';
import { BomService } from './../../../shared/services/bom.service';
import { BomTabsConfig, BomFilterOptions, BomFilterConfig, BomFilterData, BomCommonTableConfig, BomTableProptery, BomTableMaterials } from './../../../shared/models/bom.model';
import { ProjectService } from './../../../shared/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectDetails, ProjetPopupData } from './../../../shared/models/project-details';
import { Component, OnInit } from "@angular/core";
import { removeData } from 'jquery';
import { filter } from 'rxjs/operators';
@Component({
    selector: "app-bom",
    templateUrl: "./bom.component.html"
})
export class BomComponent implements OnInit {

    product: ProjectDetails;
    projectId: number;
    orgId: number;
    userId: number;
    tabs: BomTabsConfig[] = [];
    searchConfig: BomFilterConfig;
    selectedIndex: number = 0;
    filterOptions: BomFilterData = {};
    isMobile: boolean;
    isFormValid: boolean = false;
    tabsFormData: any = {};
    subscriptions: Subscription[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private bomService: BomService,
        private commonService: CommonService,
        private _snackBar: MatSnackBar,
        private loading: GlobalLoaderService,
        private router: Router,
        private fbPixel: FacebookPixelService,
        private navService: AppNavigationService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.activatedRoute.params.subscribe(params => {
            this.projectId = params[ "id" ];
        });
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
        this.startSubscription();
        this.getReadyBomFilter();
        this.getTabsData();
        this.getProject(this.projectId);
    }

    // creating bom filter options configuration 

    getReadyBomFilter() {
        let options: BomFilterOptions[] = [
            {
                name: 'Trades',
                type: 'MULTI_SELECT_SEARCH',
                key: 'tradeNames',
                id: 0,
                preSelected: []
            },
            {
                name: 'Category',
                type: 'MULTI_SELECT_SEARCH',
                key: 'categoryNames',
                id: 1,
                dependSearch: 0
            },
            {
                name: 'Search Material',
                type: 'INPUT_TEXT_SEARCH',
                key: 'materialName',
                id: 2
            }
        ]


        forkJoin([ this.bomService.getOrgTrades(this.projectId) ]).toPromise().then(res => {
            options[ 0 ].data = this.getTradesList(res[ 0 ]);
            options[ 0 ].preSelected = this.preselectedTrade(options[ 0 ].data);
            options[ 1 ].data = [];

            this.filterOptions[ options[ 0 ].key ] = options[ 0 ].preSelected;

            this.searchConfig = {
                title: 'Search In',
                options
            }
            this.getTableData();
        });

    }

    preselectedTrade(res) {
        let trades = [];
        res.forEach(item => {
            if (item.isAttatched) {
                trades.push(item);
            }
        });
        return trades;
    }

    getTradesList(res) {
        let trades = [];
        res.data.forEach(item => {
            if (item.tradeName !== 'General Contractor' && item.tradeName !== 'Others') {
                trades.push({ ...item, name: item.tradeName, id: item.tradeId })
            }
        });
        return trades;
    }

    // creating tabs configuration 

    getTabsData() {
        let data = [
            {
                name: 'Top Materials',
                data: [],
                functionName: 'getTrades'
            },
            {
                name: 'All Materials',
                data: [],
                functionName: 'getTrades'
            },
            {
                name: 'My Materials',
                data: [],
                functionName: 'getMyMaterial'
            }
        ]
        this.tabs = data as BomTabsConfig[];
    }

    getProject(id: number) {
        this.projectService.getProject(this.orgId, id).then(data => {
            this.product = data.data;
        });
    }

    deleteProject() {
        const data: ProjetPopupData = {
            isEdit: false,
            isDelete: true,
            detail: this.product
        };
        // this.openDialog(data);
    }

    editProject() {
        const data: ProjetPopupData = {
            isEdit: true,
            isDelete: false,
            detail: this.product
        };
        // this.openDialog(data);
    }

    tabClick(event) {
        if (this.tabsFormData[ this.selectedIndex ] && this.tabsFormData[ this.selectedIndex ].length) {
            this.openAddBomDialog(event.index);
        } else {
            this.selectedIndex = event.index ? event.index : 0;
            this.filterOptions.limit = this.filterOptions.limit ? this.filterOptions.limit : 25;
            this.filterOptions.pageNumber = this.filterOptions.pageNumber ? this.filterOptions.pageNumber : 1;
            this.getTableData();
        }
    }

    // get table data on load or based on filter 

    getTableData() {
        if (this.selectedIndex === 2) {
            this.commonService.getMyMaterial('allwithdeleted').then(res => {
                this.tabs[ this.selectedIndex ].data = this.setSelectedTabDataByUser(this.tabsFormData[ this.selectedIndex ], res.data);
                // this.tabs[ this.selectedIndex ].data = res.data;
                this.getBomTableConfig();
            });
        } else {

            let tradeObj: any = {};
            for (let i in this.filterOptions) {
                if ((i === 'tradeNames' || i === 'categoryNames') && this.filterOptions[ i ] && this.filterOptions[ i ].length) {
                    tradeObj[ i ] = this.bomService.getNames(this.filterOptions[ i ]);
                } else {
                    if (this.filterOptions[ i ]) {
                        tradeObj[ i ] = this.filterOptions[ i ];
                    }
                }
            }
            const checkIsValidQueryParam = this.getIsValidQueryParam(tradeObj);
            tradeObj.limit = tradeObj.limit ? tradeObj.limit : 25;
            tradeObj.pageNumber = tradeObj.pageNumber ? tradeObj.pageNumber : 1;
            tradeObj[ 'isTopMaterial' ] = this.selectedIndex === 0 ? 1 : 0;
            if (checkIsValidQueryParam) {
                this.bomService[ this.tabs[ this.selectedIndex ][ 'functionName' ] ](tradeObj).then(res => {

                    this.tabs[ this.selectedIndex ].data = this.setSelectedTabDataByUser(this.tabsFormData[ this.selectedIndex ], res.materialTrades);

                    // this.tabs[ this.selectedIndex ].data = res.materialTrades;
                    this.tabs[ this.selectedIndex ].paginatorOptions = {
                        limit: res.limit,
                        pageNumber: res.pageNumber,
                        totalCount: res.totalCount
                    } as PaginatorConfig;
                    this.getBomTableConfig();
                });
            }
        }
    }

    getIsValidQueryParam(data) {
        let result = false;
        for (let key in data) {
            if ((data[ key ] !== null && (key === 'tradeNames' && data[ key ].length) || (key === 'categoryNames' && data[ key ].length) || (key === 'materialName' && data[ key ]))) {
                result = true;
            }
        }
        return result;
    }

    // get data after applying filter 

    getFilterBomData(data) {
        const tabConfig = {
            name: 'Search Materials',
            data: [],
            functionName: 'getTrades'
        }
        const tabExist = this.tabs.some(item => item.name === 'Search Materials');
        if (!tabExist) {
            this.tabs.push(tabConfig);
        }
        for (let i in data) {
            if (data[ i ]) {
                this.filterOptions[ i ] = data[ i ];
            } else {
                this.filterOptions[ i ] = null;
            }
        }
        this.selectedIndex = 3;
        this.getTableData();
    }

    // creating bom table data configuration as per the requirement. field can be managed which need to show

    getBomTableConfig() {
        let tableConfig: BomCommonTableConfig = {};
        tableConfig.groupName = { visible: true, formProperty: true } as BomTableProptery;
        tableConfig.materialList = {} as BomTableMaterials;

        tableConfig.materialList.materialName = { visible: true, formProperty: true, headName: 'Material Name' } as BomTableProptery;
        tableConfig.materialList.tradeList = { visible: true, formProperty: true, headName: 'Trade' } as BomTableProptery;
        tableConfig.materialList.materialUnit = { visible: true, formProperty: true, headName: 'Unit' } as BomTableProptery;
        tableConfig.materialList.estimatedQty = { visible: true, formProperty: true, headName: 'Estimated Quantity' } as BomTableProptery;
        tableConfig.materialList.estimatedRate = { visible: true, formProperty: true, headName: 'Estimated Rate' } as BomTableProptery;
        tableConfig.materialList.id = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.materialCode = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.materialGroup = { visible: false, formProperty: false } as BomTableProptery;
        tableConfig.materialList.pid = { visible: false, formProperty: false } as BomTableProptery;
        tableConfig.materialList.treadId = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.tradeName = { visible: false, formProperty: true } as BomTableProptery;

        this.tabs[ this.selectedIndex ][ 'table' ] = tableConfig;
    }

    saveCategory() {
        this.tabsFormData[ this.selectedIndex ].forEach(item => {

            item[ 'estimatedRate' ] = item[ 'estimatedRate' ] !== null ? item[ 'estimatedRate' ] : 0;
            delete item[ 'isNull' ];
            delete item[ 'tradeList' ];
            delete item[ 'treadId' ];
        })
        this.bomService
            .sumbitCategory(this.userId, this.projectId, this.tabsFormData[ this.selectedIndex ])
            .then(res => {
                this.fbPixel.fire('AddToCart');
                this.navService.gaEvent({
                    action: 'submit',
                    category: 'material_added',
                    label: 'material name',
                    value: null
                });
                this.tabsFormData[ this.selectedIndex ] = [];
                this.tabs[ this.selectedIndex ].selectedMaterialLength = 0;
                this.isFormValid = false;
                this.router.navigate([ "project-dashboard/bom/" + this.projectId + "/bom-detail" ]);
            });
    }

    openAddMyMaterial() {
        let data = this.projectId
        const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
            width: "1400px",
            data,
            panelClass: 'add-custom-material'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null) {
                this.getProject(this.projectId);
                this.getTableData();
            }
        })
    }

    // download material data excel template 

    downloadExcel(url: string) {
        var win = window.open(url, "_blank");
        win.focus();
    }

    // upload material list excel 

    uploadExcel(files: FileList) {
        const data = new FormData();
        data.append("file", files[ 0 ]);
        var fileSize = files[ 0 ].size; // in bytes
        if (fileSize < 5000000) {
            this.postMaterialExcel(data);
        }
        else {
            this._snackBar.open("File must be less than 5 mb", "", {
                duration: 2000,
                panelClass: [ "success-snackbar" ],
                verticalPosition: "bottom"
            });
        }
    }

    postMaterialExcel(data) {
        this.loading.show();
        this.bomService.postMaterialExcel(data, this.projectId).then(res => {
            this.router.navigate([ "project-dashboard/bom/" + this.projectId + "/bom-detail" ]);
            this.loading.hide();
            if (res.statusCode === 201) {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    data: res.data,
                    duration: 6000,
                    panelClass: [ "success-snackbar" ],
                    verticalPosition: "bottom"
                });
            } else {
                this._snackBar.open(res.message, "", {
                    duration: 2000,
                    panelClass: [ "success-snackbar" ],
                    verticalPosition: "bottom"
                });
            }
        });
    }

    // paginator data poRequestData

    getPaginationRequest(data) {
        for (let i in data) {
            this.filterOptions[ i ] = data[ i ];
        }
        this.getTableData();
    }

    // Bom table data request on change in table 

    getBomTableRequest(data) {
        const filterData = this.upateStoreDataByUser(this.tabsFormData[ this.selectedIndex ], data);
        if (filterData.length) {
            this.tabsFormData[ this.selectedIndex ] = filterData;
        }
        this.tabs[ this.selectedIndex ].selectedMaterialLength = filterData.length;
        this.isFormValid = this.checkIsFormValid(filterData);
    }


    checkIsFormValid(data) {
        let result = false;
        data.forEach(itm => {
            if (itm.estimatedQty && itm.materialUnit) {
                result = true;
            }
        });
        return result;
    }

    upateStoreDataByUser(prevData, data) {
        data.forEach(item => {
            item.materialList.forEach(item => {
                if (prevData && prevData.length) {
                    let x = 0;
                    prevData.forEach(itm => {
                        if (itm.id === item.id) {
                            x = 1;
                            itm.estimatedRate = item.estimatedRate;
                            itm.estimatedQty = item.estimatedQty;
                            itm.materialUnit = item.materialUnit;
                        }
                    })
                    if (x == 0) {
                        if (item.estimatedQty || item.estimatedRate) {
                            prevData.push(item);
                        }
                    }
                } else {
                    prevData = [];
                    if (item.estimatedQty || item.estimatedRate) {
                        prevData.push(item);
                    }
                }
            });
        });
        let finalData = [];
        prevData.forEach(item => {
            if (item.estimatedQty || item.estimatedRate) {
                finalData.push(item);
            }
        })
        return finalData;
    }

    setSelectedTabDataByUser(prevData, data) {
        if (prevData && prevData.length) {
            data.forEach(item => {
                item.materialList.forEach(itm => {
                    prevData.forEach(key => {
                        if (key.id === itm.id) {
                            itm.estimatedRate = key.estimatedRate;
                            itm.estimatedQty = key.estimatedQty;
                            itm.materialUnit = key.materialUnit;
                        }
                    })
                });
            })
        }
        return data;
    }


    openAddBomDialog(index) {
        const dialogRef = this.dialog.open(AddBomWarningComponent, {
            width: "400px",
            // backdropClass: 'backdropBackground'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.saveCategory();
            } else {
                this.isFormValid = false;
                this.tabsFormData[ this.selectedIndex ] = [];
                this.tabs[ this.selectedIndex ].selectedMaterialLength = 0;
                this.getTableData();
            }
            this.selectedIndex = index ? index : 0;
        })
    }

    startSubscription() {
        this.subscriptions.push(
            this.bomService.resetBomFilter$.subscribe(_ => {
                this.tabs.forEach((item, index) => {
                    if (item.name === 'Search Materials') {
                        if (this.selectedIndex === index) {
                            this.selectedIndex = 0;
                        }
                        this.tabs.splice(index, 1);
                    }
                })
                for (let i in this.filterOptions) {
                    if (i !== 'tradeNames') {
                        this.filterOptions[ i ] = null;
                    }
                }
                this.getTableData();
            })
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach(item => item.unsubscribe);
    }


}
