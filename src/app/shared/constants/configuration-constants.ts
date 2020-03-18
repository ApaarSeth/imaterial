


export const ConfigurationConstants = {
  HEADER_SKIP_LOADER: "Skip-Loader",
  HEADER_CACHE_REQUEST: "Cache-Request",
}

export class Froala {
  public static key: String = 'iMFIZJNKLDXIREJI==';
}

export const HeaderConstants = {
  PERMISSIONHEADER: (permissionObj, orgId) => {
    return [
      { name: 'Dashboard', link: '/dashboard', flag: true },
      { name: 'Project Store', link: '/project-dashboard', flag: permissionObj.projectStoreFlag },
      { name: 'Global Store', link: '/globalStore/' + orgId, flag: permissionObj.globalStoreFlag },
      { name: 'Request For Quotation', link: '/rfq/rfq-detail', flag: permissionObj.rfqFlag },
      { name: 'Users', link: '/users/user-detail', flag: permissionObj.usersFlag },
      { name: 'Purchase Order', link: '/po/detail-list', flag: permissionObj.purchaseOrderFlag },
      { name: 'Supplier', link: '/supplier/detail', flag: permissionObj.supplierFlag }
    ]

  }
}

export const API = {
  PROJECTS: (organizationId, userId) => `projects/${organizationId}/${userId}`,
  GETPROJECT: (organizationId, projectId) => `project/${organizationId}/${projectId}`,
  GETCATERGORY: `material/groups`,
  ADDPROJECT: `addProject`,
  UPDATEPROJECT: (organizationId, projectId) => `updateProjectDetails/${organizationId}/${projectId}`,
  RAISEINDENT: projectId => `indent/raise/${projectId}`,
  DELETE: (organizationId, projectId) => `deleteProject/${organizationId}/${projectId}`,
  GETMATERIALSWITHSPECS: `material/materialsSpecs`,
  GETMATERIALSWITHQUANTITY: (organizationId, projectId) => `materials/${organizationId}/${projectId}`,
  GETINDENTLIST: projectId => `indent/list/${projectId}`,
  POSTMATERIALSQUANTITY: (userId, projectId) => `materials/${userId}/${projectId}`,
  GETMATERIALWISE: organizationId => `global/materials/${organizationId}`,
  GETPROJECTWISE: organizationId => `global/projects/${organizationId}`,
  RFQMATERIALS: `rfqMaterials`,
  RFQDETAIL: organizationId => `rfq/list/${organizationId}`,
  RFQPO: (organizationId, rfqId) => `rfq/details/${organizationId}/${rfqId}`,
  RFQADDPO: `po/addPO`,
  GETSUPPLIERS: organizationId => `projects/getsuppliers/${organizationId}`,
  ADDSUPPLIER: organizationId => `projects/addSuppliers/${organizationId}`,
  GETPODETAILLIST: organizationId => `po/detail/list/${organizationId}`,
  GETPODATA: poId => `po/genarate/${poId}`,
  SENDPODATA: `po/updatePO`,
  ADDRFQ: `rfq/addrfq`,
  GETRFQDETAILSUPPLIER: (rfqId, supplierId) => `rfq/details/supplier/${rfqId}/${supplierId}`,
  POSTRFQDETAILSUPPLIER: supplierId => `rfq/addSupplierDetail/${supplierId}`,
  GETAPPROVER: (organizationId, projectId) => `po/users/${organizationId}/${projectId}`,
  POSTADDADDRESS: (type, id) => `address/add/${type}/${id}`,
  GETPOADDADDRESS: (type, id) => `address/get/${type}/${id}`,
  POSTDOCUMENTUPLOAD: `documents/upload`,
  SIGNUP: `api/auth/signup`,
  SIGNIN: `oauth/token`,
  GETISSUETOINDENT: (materialId, projectId) => `materials/updateStock/${materialId}/${projectId}`,
  POSTISSUETOINDENT: materialId => `indent/issueQty/${materialId}`,
  GETSINGLEINDENT: indentId => `indent/detail/${indentId}`,
  GETGRNDETAILS: grnId => `po/view/grn/poDetails/${grnId}`,
  ADDGRN: `po/add/grn`,
  VIEWGRN: (organizationId, purchaseOrderId) => `po/grn/detail/${organizationId}/${purchaseOrderId}`,
  GETRFQVIEW: rfqId => `rfq/view/details/${rfqId}`,
  ROLES: `user/getroles`,
  ALLUSERS: organizationId => `user/getall/${organizationId}`,
  ADDUSER: `user/add`,
  EDITUSER: `user/update/roleproject`,
  DEACTIVATEUSER: userId => `user/delete/${userId}`,
  UPLOADEXCEL: projectId => `bom/materials/fileupload/${projectId}`,
  DELETESUPPLIER: supplierId => `projects/deleteSupplier/${supplierId}`,
  DELETEMATERIAL: (projectId, materialId) => `material/delete/${projectId}/${materialId}`,
  APPROVEREJECTPO: `po/approveRejectPO`,
  GETGENERATEDRFQ: rfqId => `fq/stepper/${rfqId}`,
  DELETEDRAFTEDPO: purchaseOrderId => `po/delete/${purchaseOrderId}`,
  GETSUPPLIERADDRESS: supplierId => `address/get/Supplier/${supplierId}`,
  ADDSUPPLIERADDRESS: supplierId => `address/add/Supplier/${supplierId}`,
  NUMBERTOWORDS: currency => `commons/numtowords/${currency}`,
  GET_USER_PROFILE: USERID => `user/profile/${USERID}`,
  GET_ALL_TRADES: 'all/tades',
  SUBMIT_USER_DETAILS: 'user/update/profile',
  GET_NOTIFICATIONS: userId => `user/notification/${userId}`,
  GETRFQTERMS: 'rfq/payment/terms',
  GETADDEDRFQ: rfqId => `rfq/stepper/${rfqId}`,
  GET_USER_INFO_UNIQUE_CODE: uniqueCode => `user/info/${uniqueCode}`,
  GET_DASHBOARD_DATA: 'dashboard',
  UPLOADSUPPLIEREXCEL: organisationId => `projects/uploadSuppliers/${organisationId}`,
  GETCITYANDSTATE: pincode => `city-state/get/${pincode}`,
  SENDOTP: phone => `api/auth/otp/create?phone=${phone}`,
  VERIFYOTP: (phone, otp) => `api/auth/otp/verify?phone=${phone}&otp=${otp}`,
  VERIFYEMAIL: email => `verify/email?email=${email}`,
  GETUSERGUIDEFLAG: `userGuide`,
  SENDUSERGUIDEFLAG: `add/userGuide`,
  GETBOMTRADES: `material/get/trades`,
<<<<<<< HEAD
  ORGANIZATIONTRADES: projectId => `all/org/trades/${projectId}`,
  PROJECTTRADES: `add/projectTrades`
=======
  ORGANIZATIONTRADES: `all/org/tades`,
  TERMS:id => `update/terms/${id}`
>>>>>>> f18a6955e6469b0e980ed3189b7df023f408f931
};
