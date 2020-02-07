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
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-rfq-bids",
  templateUrl: "./rfq-bids.component.html",
  styleUrls: [
    "../../../../assets/scss/main.scss",
    "../../../../assets/scss/pages/rfq-bids.component.scss"
  ]
})
export class RfqBidsComponent implements OnInit {
  constructor(
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}
  rfqProjects: RfqProject[];
  rfqForms: FormGroup;
  rfqId: number;
  orgId:number
  
  ngOnInit() {
    this.orgId=Number(localStorage.getItem("orgId"))
    this.route.params.subscribe(rfqId => {
      this.rfqId = Number(rfqId.id);
    });
    this.rfqService.rfqPo(this.orgId, this.rfqId).then(res => {
      this.rfqProjects = res.data;
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
                  }
                );
                return this.formBuilder.group({
                  supplierId: supplier.supplierId,
                  supplierAddressId: null,
                  supplierName: supplier.supplierName,
                  brandGroup: this.formBuilder.array(brandGrp)
                });
              }
            );

            return this.formBuilder.group({
              materialId: material.materialId,
              materialQty: material.materialQty,
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
          materialList: this.formBuilder.array(materialGrp)
        });
      }
    );
    this.rfqForms = this.formBuilder.group({});
    this.rfqForms.addControl("forms", new FormArray(frmArr));
    console.log(this.rfqForms);
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
          return {
            projectId: proj.projectId,
            projectName: proj.projectName,
            projectAddressId: proj.projectAddressId,
            addressId: proj.projectAddressId,
            ...supplierData,
            rfqId: this.rfqId,
            materialList
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
                    materialUnitPrice
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
          console.log(suppList);
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
    console.log(submitData.flat(2));
    this.rfqService.rfqAddPo(submitData.flat(2));
  }
}
