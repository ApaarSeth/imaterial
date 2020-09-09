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
    formData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private bomService: BomService,
        private commonService: CommonService,
        private _snackBar: MatSnackBar,
        private loading: GlobalLoaderService,
        private router: Router,
        private fbPixel: FacebookPixelService,
        private navService: AppNavigationService
    ) {
    }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.activatedRoute.params.subscribe(params => {
            this.projectId = params["id"];
        });
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
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


        forkJoin([this.bomService.getOrgTrades(this.projectId)]).toPromise().then(res => {
            options[0].data = this.getTradesList(res[0]);
            options[0].preSelected = this.preselectedTrade(options[0].data);
            options[1].data = [];

            this.filterOptions[options[0].key] = options[0].preSelected;

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

        this.filterOptions.limit = this.filterOptions.limit ? this.filterOptions.limit : 25;
        this.filterOptions.pageNumber = this.filterOptions.pageNumber ? this.filterOptions.pageNumber : 1;
        this.getTableData();
    }

    // get table data on load or based on filter 

    getTableData() {
        if (this.selectedIndex === 2) {
            this.commonService.getMyMaterial('allwithdeleted').then(res => {
                this.tabs[this.selectedIndex].data = res.data;
                this.getBomTableConfig();
            });
        } else {

            let tradeObj: any = {};
            for (let i in this.filterOptions) {
                if (i === 'tradeNames' || i === 'categoryNames') {
                    tradeObj[i] = this.bomService.getNames(this.filterOptions[i]);
                } else {
                    tradeObj[i] = this.filterOptions[i];
                }
            }
            tradeObj.limit = tradeObj.limit ? tradeObj.limit : 25;
            tradeObj.pageNumber = tradeObj.pageNumber ? tradeObj.pageNumber : 1;
            tradeObj['isTopMaterial'] = this.selectedIndex === 0 ? 1 : 0;
            this.bomService[this.tabs[this.selectedIndex]['functionName']](tradeObj).then(res => {
                this.tabs[this.selectedIndex].data = res.materialTrades;
                this.tabs[this.selectedIndex].paginatorOptions = {
                    limit: res.limit,
                    pageNumber: res.pageNumber,
                    totalCount: res.totalCount
                }
                this.getBomTableConfig();
            });
        }
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

        this.selectedIndex = 3;
        for (let i in data) {
            this.filterOptions[i] = data[i];
        }
        this.getTableData();
    }

    // creating bom table data configuration as per the requirement. field can be managed which need to show

    getBomTableConfig() {
        let tableConfig: BomCommonTableConfig = {};
        tableConfig.groupName = { visible: true, formProperty: true } as BomTableProptery;
        tableConfig.materialList = {} as BomTableMaterials;

        tableConfig.materialList.materialName = { visible: true, formProperty: true, headName: 'Material Name' } as BomTableProptery;
        tableConfig.materialList.tradeList = { visible: true, formProperty: true, headName: 'Trade' } as BomTableProptery;
        tableConfig.materialList.materialUnit = { visible: true, formProperty: true, headName: 'Unit', any: 1 } as BomTableProptery;
        tableConfig.materialList.estimatedQty = { visible: true, formProperty: true, headName: 'Estimated Quantity', any: 1 } as BomTableProptery;
        tableConfig.materialList.estimatedRate = { visible: true, formProperty: true, headName: 'Estimated Rate' } as BomTableProptery;
        tableConfig.materialList.id = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.materialCode = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.materialGroup = { visible: false, formProperty: false } as BomTableProptery;
        tableConfig.materialList.pid = { visible: false, formProperty: false } as BomTableProptery;
        tableConfig.materialList.treadId = { visible: false, formProperty: true } as BomTableProptery;
        tableConfig.materialList.tradeName = { visible: false, formProperty: true } as BomTableProptery;

        this.tabs[this.selectedIndex]['table'] = tableConfig;
    }

    saveCategory() {
        this.bomService
            .sumbitCategory(this.userId, this.projectId, this.formData)
            .then(res => {
                this.fbPixel.fire('AddToCart');
                this.navService.gaEvent({
                    action: 'submit',
                    category: 'material_added',
                    label: 'material name',
                    value: null
                });
                this.router.navigate(["project-dashboard/bom/" + this.projectId + "/bom-detail"]);
            });
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

    // download material data excel template 

    downloadExcel(url: string) {
        var win = window.open(url, "_blank");
        win.focus();
    }

    // upload material list excel 

    uploadExcel(files: FileList) {
        const data = new FormData();
        data.append("file", files[0]);
        var fileSize = files[0].size; // in bytes
        if (fileSize < 5000000) {
            this.postMaterialExcel(data);
        }
        else {
            this._snackBar.open("File must be less than 5 mb", "", {
                duration: 2000,
                panelClass: ["success-snackbar"],
                verticalPosition: "bottom"
            });
        }
    }

    postMaterialExcel(data) {
        this.loading.show();
        this.bomService.postMaterialExcel(data, this.projectId).then(res => {
            this.router.navigate(["project-dashboard/bom/" + this.projectId + "/bom-detail"]);
            this.loading.hide();
            if (res.statusCode === 201) {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    data: res.data,
                    duration: 6000,
                    panelClass: ["success-snackbar"],
                    verticalPosition: "bottom"
                });
            } else {
                this._snackBar.open(res.message, "", {
                    duration: 2000,
                    panelClass: ["success-snackbar"],
                    verticalPosition: "bottom"
                });
            }
        });
    }

    // paginator data poRequestData

    getPaginationRequest(data) {
        for (let i in data) {
            this.filterOptions[i] = data[i];
        }
        this.getTableData();
    }

    // Bom table data request on change in table 

    getBomTableRequest(data) {
        this.isFormValid = data.valid;
        this.formData = data.value.material;
    }

}
