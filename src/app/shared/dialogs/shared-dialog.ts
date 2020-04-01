import { AddProjectComponent } from "./add-project/add-project.component";
import { DoubleConfirmationComponent } from "./double-confirmation/double-confirmation.component";
import { SuppliersDialogComponent } from "./add-supplier/suppliers-dialog.component";
import { ViewDocumentsDialogComponent } from "./view-documents/view-documents-dialog.component";
import { AddCommentDialogComponent } from "./add-comment/comment-dialog.component";
import { AddAddressDialogComponent } from "./add-address/address-dialog.component";
import { IssueToIndentDialogComponent } from "./issue-to-indent/issue-to-indent-dialog.component";
import { AddRFQConfirmationComponent } from "./add-rfq-confirmation/add-rfq-double-confirmation.component";
import { SelectApproverComponent } from "./selectPoApprover/selectPo.component";
import { SelectPoRoleComponent } from "./select-po-role/select-po-role.component";
import { AddAddressPoDialogComponent } from "./add-address-po/add-addressPo.component";
import { AddEditUserComponent } from "./add-edit-user/add-edit-user.component";
import { DeactiveUserComponent } from "./disable-user/disable-user.component";
import { DeactiveSupplierComponent } from "./disable-supplier/disable-supplier.component";
import { ConfirmRfqBidComponent } from "./confirm-rfq-bid/confirm-frq-bid-component";
import { DeleteBomComponent } from "./delete-bom/delete-bom.component";
import { AddEditGrnComponent } from "./add-edit-grn/add-edit-grn.component";
import { DeleteDraftedPoComponent } from "./delete-drafted-po/delete-drafted-po.component";
import { SelectRfqTermsComponent } from "./selectrfq-terms/selectrfq-terms.component";
import { SelectProjectComponent } from './select-project/select-project.component';
import { GSTINMissingComponent } from './gstin-missing/gstin-missing.component';

export const SharedDialogs = [
  AddProjectComponent,
  DoubleConfirmationComponent,
  SuppliersDialogComponent,
  ViewDocumentsDialogComponent,
  AddCommentDialogComponent,
  AddAddressDialogComponent,
  AddEditUserComponent,
  IssueToIndentDialogComponent,
  AddRFQConfirmationComponent,
  SelectApproverComponent,
  SelectPoRoleComponent,
  AddAddressPoDialogComponent,
  DeactiveUserComponent,
  DeactiveSupplierComponent,
  ConfirmRfqBidComponent,
  DeleteBomComponent,
  AddEditGrnComponent,
  DeleteDraftedPoComponent,
  SelectRfqTermsComponent,
  SelectProjectComponent,
  GSTINMissingComponent
];
