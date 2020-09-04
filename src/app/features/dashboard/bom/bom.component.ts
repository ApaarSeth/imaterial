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
@Component({
    selector: "app-bom",
    templateUrl: "./bom.component.html"
})
export class BomComponent implements OnInit {

    product: ProjectDetails;
    projectId: number;
    orgId: number;
    tabs: BomTabsConfig[] = [];
    searchConfig: BomFilterConfig;
    selectedIndex: number = 0;
    filterOptions: BomFilterData = {};
    isMobile: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private bomService: BomService,
        private commonService: CommonService,
        private _snackBar: MatSnackBar,
        private loading: GlobalLoaderService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.activatedRoute.params.subscribe(params => {
            this.projectId = params[ "id" ];
        });
        this.orgId = Number(localStorage.getItem("orgId"));
        this.getReadyBomFilter();
        this.getTabsData();
        this.getProject(this.projectId);
    }

    getReadyBomFilter() {
        let options: BomFilterOptions[] = [
            {
                name: 'Trades',
                type: 'MULTI_SELECT_SEARCH',
                key: 'tradeList',
                id: 0,
                preSelected: []
            },
            {
                name: 'Category',
                type: 'MULTI_SELECT_SEARCH',
                key: 'categoryList',
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

            this.filterOptions.tradeList = this.bomService.getNames(options[ 0 ].preSelected);

            this.searchConfig = {
                title: 'Filter By',
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

    getTabsData() {
        let data = [
            {
                name: 'Top Materials',
                data: [],
                functionName: 'getTrades',
                key: 'tradeList'
            },
            {
                name: 'All Materials',
                data: [],
                functionName: 'getTrades',
                key: 'tradeList'
            },
            {
                name: 'My Materials',
                data: [],
                functionName: 'getMyMaterial',
                key: 'tradeList'
            }
        ]
        this.tabs = data as BomTabsConfig[];
    }

    getProject(id: number) {
        this.projectService.getProject(this.orgId, id).then(data => {
            this.product = data.data;
            //   if ((localStorage.getItem('addBom') == "null") || (localStorage.getItem('addBom') == '0')) {
            // setTimeout(() => {
            //   this.guidedTourService.startTour(this.BomDashboardTour);
            // }, 1000);
            //   }
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
        this.selectedIndex = event.index ? event.index : 0;
        this.getTableData();
    }

    getTableData() {
        if (this.selectedIndex === 2) {
            this.commonService.getMyMaterial('allwithdeleted').then(res => {
                console.log(res.data);
                this.tabs[ this.selectedIndex ].data = [ ...res.data ];
                this.getBomTableConfig();
            });
        } else {
            let tradeObj = {};
            this.bomService[ this.tabs[ this.selectedIndex ][ 'functionName' ] ](tradeObj).then(res => {
                console.log(res);
                this.tabs[ this.selectedIndex ].data = [ ...res ];
                this.getBomTableConfig();
            });
        }
    }


    getFilterBomData(event) {
        console.log(event);
        this.getTableData();
    }

    getBomTableConfig() {
        let tableConfig: BomCommonTableConfig = {};
        tableConfig.groupName = { visible: true, formProperty: true } as BomTableProptery;
        tableConfig.materialList = {} as BomTableMaterials;
        if (this.selectedIndex === 0 || this.selectedIndex === 1 || this.selectedIndex === 2) {
            tableConfig.materialList.materialName = { visible: true, formProperty: true, headName: 'Material Name' } as BomTableProptery;
            tableConfig.materialList.tradeList = { visible: true, formProperty: true, headName: 'Trade' } as BomTableProptery;
            tableConfig.materialList.materialUnit = { visible: true, formProperty: true, headName: 'Unit' } as BomTableProptery;
            tableConfig.materialList.estimatedQty = { visible: true, formProperty: true, headName: 'Estimated Quantity' } as BomTableProptery;
            tableConfig.materialList.estimatedRate = { visible: true, formProperty: true, headName: 'Estimated Rate' } as BomTableProptery;
            tableConfig.materialList.id = { visible: true, formProperty: true } as BomTableProptery;
            tableConfig.materialList.materialCode = { visible: false, formProperty: true } as BomTableProptery;
            tableConfig.materialList.materialGroup = { visible: false, formProperty: false } as BomTableProptery;
            tableConfig.materialList.pid = { visible: false, formProperty: false } as BomTableProptery;
            tableConfig.materialList.treadId = { visible: false, formProperty: true } as BomTableProptery;
            tableConfig.materialList.tradeName = { visible: false, formProperty: true } as BomTableProptery;
        }
        this.tabs[ this.selectedIndex ][ 'table' ] = tableConfig;
    }

    saveCategory() {

    }

    openAddMyMaterial() {
        // let data = this.projectId
        // const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
        //   width: "1400px",
        //   data,
        //   panelClass: 'add-custom-material'
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result !== null) {
        //     this.getProject(this.projectId);
        //     this.callApi()
        //   }
        // })
    }

    downloadExcel(url: string) {
        var win = window.open(url, "_blank");
        win.focus();
    }

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


}
