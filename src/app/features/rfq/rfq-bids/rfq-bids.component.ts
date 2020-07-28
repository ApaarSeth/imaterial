import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import {
  RfqProjects,
  RfqProject,
  RfqMaterialList,
  RfqProjectSubmit,
  MaterialListSubmit,
  RfqSupplierList
} from "src/app/shared/models/RFQ/rfqBids";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { map } from "rxjs/operators";
import { Materials } from "src/app/shared/models/subcategory-materials";
import { ActivatedRoute, Router } from "@angular/router";
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShowSupplierRemarksandDocs } from 'src/app/shared/dialogs/show-supplier-remarks-documents/show-supplier-remarks-documents.component';
import { ProjectItemComponent } from 'src/app/shared/components/project-item/project-item.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

@Component({
  selector: "app-rfq-bids",
  templateUrl: "./rfq-bids.component.html"
})
export class RfqBidsComponent implements OnInit {

  constructor(
    private router: Router,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private navService: AppNavigationService,
    private _snackBar: MatSnackBar
  ) { }

  rfqProjects: RfqProject[] = [];
  rfqForms: FormGroup;
  rfqId: number;
  orgId: number;
  ratesBaseCurr: boolean = false;
  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.route.params.subscribe(rfqId => {
      this.rfqId = Number(rfqId.id);
    });
    this.rfqService.rfqPo(this.orgId, this.rfqId).then(res => {
      this.rfqProjects = res.data;

      this.rfqProjects.forEach(project => {
        project.materialList.forEach(matList => {
            matList.supplierList.forEach((supp, i) => {
                const bidSubmitted = supp.brandDetailList.filter(brand => brand.materialUnitPrice !== null);
                if(bidSubmitted.length > 0){
                    supp.documentList = [...(supp.documentList ? supp.documentList : []), ...(matList.documentList ? matList.documentList : [])];
                }
            })
        })
      });

      this.formInit();
    });
  }
  formInit() {
    const frmArr: FormGroup[] = this.rfqProjects.map(
      (project: RfqProject, m) => {
        let materialGrp: FormGroup[] = project.materialList.map(
          (material: RfqMaterialList, s) => {
            let supplierGrp = material.supplierList.map(
              (supplier: RfqSupplierList, i) => {
                let brandGrp: FormGroup[] = supplier.brandDetailList.map(
                  brand => {
                    return this.formBuilder.group({
                      brand: [brand],
                      quantity: []
                    });
                  });
                return this.formBuilder.group({
                  supplierId: supplier.supplierId,
                  supplierAddressId: null,
                  supplierName: supplier.supplierName,
                  materialIgst: supplier.materialIgst,
                  materialCgst: supplier.materialCgst,
                  materialSgst: supplier.materialSgst,
                  taxInfo: supplier.taxInfo ? this.formBuilder.array(supplier.taxInfo) : null,
                  otherCostInfo: supplier.otherCostInfo ? this.formBuilder.array(supplier.otherCostInfo) : null,
                  documentList: supplier.documentList ? this.formBuilder.array(supplier.documentList) : null,
                  brandGroup: this.formBuilder.array(brandGrp)
                });
              }
            );

            return this.formBuilder.group({
              materialId: material.materialId,
              documentList: material.documentList ? this.formBuilder.array(material.documentList) : null,
              materialQty: material.materialQty,
              materialpoAvailableQty: material.poAvailableQty,
              validQtyBoolean: true,
              materialUnitPrice: material.materialUnitPrice,
              supplierList: this.formBuilder.array(supplierGrp)
            });
          }
        );
        return this.formBuilder.group({
          projectId: project.projectId,
          projectName: project.projectName,
          projectAddressId: project.projectAddressId,
          addressId: project.projectAddressId,
          materialList: this.formBuilder.array(materialGrp),
          rfqCurrency: project.rfqCurrency,
          additionalOtherCostInfo: this.formBuilder.array(project.additionalOtherCostInfo)
        });
      }
    );
    this.rfqForms = this.formBuilder.group({});
    this.rfqForms.addControl("forms", new FormArray(frmArr));
  }

  get currency() {
    return this.ratesBaseCurr
      ? this.rfqProjects[0].rfqCurrency.primaryCurrencyName
      : this.rfqProjects[0].rfqCurrency.exchangeCurrencyName
  }

  allocateQuantity() {
    const submitData: RfqProjectSubmit[] = this.rfqForms.value.forms.reduce(
      (data, proj) => {
        const createProject = (
          supplierData: {
            supplierId: number;
            supplierAddressId: number;
            supplierName: string;
          },
          materialList: MaterialListSubmit[]
        ): RfqProjectSubmit => {
          let additionalOtherCost = proj.additionalOtherCostInfo.filter(val => val.supplierId === supplierData.supplierId)
          return {
            projectId: proj.projectId,
            projectName: proj.projectName,
            projectAddressId: proj.projectAddressId,
            addressId: proj.projectAddressId,
            ...supplierData,
            rfqId: this.rfqId,
            materialList,
            rfqCurrency: proj.rfqCurrency,
            additionalOtherCostInfo: additionalOtherCost
          };
        };
        const getMaterialsForUnicSupp = (suppId): MaterialListSubmit[] =>
          proj.materialList
            .map(mat => {
              const requiredSupp = mat.supplierList.filter(
                sup => sup.supplierId === suppId
              );
              return requiredSupp.map(sup => {
                return sup.brandGroup.map(brandData => {
                  const { materialId, materialUnitPrice } = mat;
                  return {
                    materialId,
                    materialQty: Number(brandData.quantity),
                    brandName: brandData.brand.brandName,
                    materialUnitPrice: brandData.brand.materialUnitPrice,
                    materialSgst: sup.materialSgst,
                    materialCgst: sup.materialCgst,
                    materialIgst: sup.materialIgst,
                    taxInfo: sup.taxInfo ? [...sup.taxInfo] : null,
                    otherCostInfo: sup.otherCostInfo ? [...sup.otherCostInfo] : null,
                    documentList: (sup.documentList ? sup.documentList : [])
                  };
                });
              });
            })
            .flat(2);
        const getAllSupplierProj = (proj: RfqProject) => {
          let suppList = [];
          proj.materialList.forEach(mat => {
            mat.supplierList.forEach(supp => {
              if (suppList == null) {
                suppList.push(supp);
              } else {
                let check = 0;
                for (let supplier of suppList) {
                  if (supp.supplierId === supplier.supplierId) {
                    check++;
                  }
                }
                if (check == 0) {
                  suppList.push(supp);
                }
              }
            });
          });
          return suppList;
        };
        const project = () => {
          let supplierList = getAllSupplierProj(proj);
          return supplierList.map(supp => {
            const matList = getMaterialsForUnicSupp(supp.supplierId).filter(
              material => material.materialQty != null
            );
            const suppData = {
              supplierId: supp.supplierId,
              supplierAddressId: supp.supplierAddressId,
              supplierName: supp.supplierName
            };
            return createProject(suppData, matList);
          });
        };
        data.push(project());
        return data;
      },
      [] as RfqProjectSubmit[]
    );

    this.rfqService.rfqAddPo(submitData.flat(2)).then(res => {
      if (res.statusCode === 201) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'po_created',
          label: 'material name',
          value: null
        });
        this.router.navigate(["po"]);
      }
    });
  }
  getFormValidation() {
    return this.rfqForms.value.forms.some(value => {
      return value.materialList.some(materials => {
        return materials.supplierList.some(supplier => {
          return supplier.brandGroup.some(brand => {
            return (brand.quantity > 0);
          });
        });
      });
    });
  }
  getFormQtyValidation() {
    return this.rfqForms.value.forms.some(value => {
      return value.materialList.some(materials => {
        return (materials.validQtyBoolean === false);
      });
    });
  }

  getQuanityValidation(p, m) {
    this.rfqForms.controls.forms['controls'][p].controls.materialList.controls[m].controls.validQtyBoolean.setValue(true);
    let total: number = 0;

    this.rfqForms.value.forms[p].materialList[m].supplierList.forEach(supplier => {
      total = 0;
      supplier.brandGroup.forEach((brand) => {
        if (brand.quantity != null) {
          total = total + Number(brand.quantity);
          if (total.toFixed(2) > this.rfqForms.value.forms[p].materialList[m].materialpoAvailableQty) {
            this.rfqForms.controls.forms['controls'][p].controls.materialList.controls[m].controls.validQtyBoolean.setValue(false);
            this._snackBar.open("Net Quantity must be less than " + this.rfqForms.value.forms[p].materialList[m].materialpoAvailableQty, "", {
              duration: 2000,
              panelClass: ["success-snackbar"],
              verticalPosition: "bottom"
            });
          }
        }
      });
    });
  }

  viewRemarks() {

    const dialogRef = this.dialog.open(ShowSupplierRemarksandDocs, {
      width: "1000px",
      data: this.rfqProjects[0].supplierRemarkList
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => { });
  }

  /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
  viewAllImages(materialId, supplierId, projectId) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: 'view-image-modal',
      data: {
        rfqId: this.rfqId,
        materialId,
        supplierId,
        type: 'bid'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
