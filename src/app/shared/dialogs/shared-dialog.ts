import { CancelSubscriptionDialog } from './../components/subscriptions/subscription-cancel/cancel-subscription-dialog.component';
import { AddProjectComponent } from "./add-project/add-project.component";
import { DoubleConfirmationComponent } from "./double-confirmation/double-confirmation.component";
import { SuppliersDialogComponent } from "./add-supplier/suppliers-dialog.component";
import { ViewDocumentsDialogComponent } from "./view-documents/view-documents-dialog.component";
import { AddCommentDialogComponent } from "./add-comment/comment-dialog.component";
import { IssueToIndentDialogComponent } from "./issue-to-indent/issue-to-indent-dialog.component";
import { AddRFQConfirmationComponent } from "./add-rfq-confirmation/add-rfq-double-confirmation.component";
import { SelectApproverComponent } from "./selectPoApprover/selectPo.component";
import { SelectPoRoleComponent } from "./select-po-role/select-po-role.component";
import { AddEditUserComponent } from "./add-edit-user/add-edit-user.component";
import { DeactiveUserComponent } from "./disable-user/disable-user.component";
import { DeleteBomComponent } from "./delete-bom/delete-bom.component";
import { AddEditGrnComponent } from "./add-edit-grn/add-edit-grn.component";
import { DeleteDraftedPoComponent } from "./delete-drafted-po/delete-drafted-po.component";
import { SelectRfqTermsComponent } from "./selectrfq-terms/selectrfq-terms.component";
import { SelectProjectComponent } from './select-project/select-project.component';
import { GSTINMissingComponent } from './gstin-missing/gstin-missing.component';
import { ViewVideoComponent } from './video-video/view-video.component';
import { AddBomWarningComponent } from './add-bom-warning/add-bom-warning.component';
import { ShowSupplierRemarksandDocs } from './show-supplier-remarks-documents/show-supplier-remarks-documents.component';
import { SelectSupplierAddressDialogComponent } from './select-supplier-address/select-supplier-address.component';
import { AddMyMaterialBomComponent } from './add-my-material-Bom/add-my-material-bom.component';
import { DisplayProjectDetailsComponent } from './display-project-details/display-project-details.component';
import { AddMyMaterialComponent } from './add-my-material/add-my-material.component';
import { EditMyMaterialComponent } from './edit-my-material/edit-my-material.component';
import { ReleaseNoteComponent } from './release-notes/release-notes.component';
import { GRNDocumentsComponent } from './add-edit-grn/grn-documents/grn-documents.component';
import { ShowDocumentComponent } from './show-documents/show-documents.component';
import { PaymentRecordComponent } from './payment-record/paymentRecord.component';
import { SnackbarComponent } from './snackbar/snackbar.compnent';
import { SelectCurrencyComponent } from './select-currency/select-currency.component';
import { TaxCostComponent } from './tax-cost/tax-cost.component';
import { AddGrnComponent } from './add-grn/add-grn.component';
import { GrnAddMaterialComponent } from './add-grn/add-material/add-material.component';
import { GrnAddSupplierComponent } from './add-grn/add-supplier/add-supplier.component';
import { AddGrnViaExcelComponent } from './addGrn-viaExcel/addGrnViaExcel.component';
import { DeleteMyMaterialComponent } from './delete-my-material-confirmation/delete-myMaterial-confirmation.component';
import { ShortCloseConfirmationComponent } from './short-close-confirmation/short-close-confirmation.component';
import { DeactiveSupplierComponent } from './disable-supplier/disable-supplier.component';
import { ConfirmRfqBidComponent } from './confirm-rfq-bid/confirm-frq-bid-component';
import { AddAddressDialogComponent } from './add-address/add-address.component';

export const SharedDialogs = [
  AddProjectComponent,
  DoubleConfirmationComponent,
  SuppliersDialogComponent,
  ViewDocumentsDialogComponent,
  AddCommentDialogComponent,
  AddEditUserComponent,
  IssueToIndentDialogComponent,
  AddRFQConfirmationComponent,
  SelectApproverComponent,
  SelectPoRoleComponent,
  AddAddressDialogComponent,
  DeactiveUserComponent,
  DeactiveSupplierComponent,
  ConfirmRfqBidComponent,
  DisplayProjectDetailsComponent,
  DeleteBomComponent,
  AddEditGrnComponent,
  DeleteDraftedPoComponent,
  SelectRfqTermsComponent,
  SelectProjectComponent,
  ViewVideoComponent,
  GSTINMissingComponent,
  AddBomWarningComponent,
  ShowSupplierRemarksandDocs,
  SelectSupplierAddressDialogComponent,
  AddMyMaterialBomComponent,
  AddMyMaterialComponent,
  EditMyMaterialComponent,
  ReleaseNoteComponent,
  GRNDocumentsComponent,
  ShowDocumentComponent,
  PaymentRecordComponent,
  SnackbarComponent,
  SelectCurrencyComponent,
  TaxCostComponent,
  AddGrnComponent,
  GrnAddMaterialComponent,
  GrnAddSupplierComponent,
  AddGrnViaExcelComponent,
  DeleteMyMaterialComponent,
  ShortCloseConfirmationComponent,
  CancelSubscriptionDialog
];
