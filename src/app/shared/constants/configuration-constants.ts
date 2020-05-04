


export const ConfigurationConstants = {
  HEADER_SKIP_LOADER: "Skip-Loader",
  HEADER_CACHE_REQUEST: "Cache-Request",
  LOADING_TIMEOUT: 500,
}

export class Froala {
  public static key: string = 'iMFIZJNKLDXIREJI==';

}

export const HeaderConstants = {
  PERMISSIONHEADER: (permissionObj, orgId) => {
    return [
      { name: 'Dashboard', link: '/dashboard', image: '../../../assets/images/dashboard-hamburger.svg', flag: true },
      { name: 'Project Store', link: '/project-dashboard', image: '../../../assets/images/Add-Project-hamburger.svg', flag: permissionObj.projectStoreFlag },
      { name: 'Global Store', link: '/globalStore/' + orgId, image: '../../../assets/images/global-store-hamburger.svg', flag: permissionObj.globalStoreFlag },
      { name: 'Request For Quotation', link: '/rfq/rfq-detail', image: '../../../assets/images/create-RFQ-hambuger.svg', flag: permissionObj.rfqFlag },
      { name: 'Users', link: '/users/user-detail', image: '../../../assets/images/user-hamburger.svg', flag: permissionObj.usersFlag },
      { name: 'Purchase Order', link: '/po/detail-list', image: '../../../assets/images/po-hamburger.svg', flag: permissionObj.purchaseOrderFlag },
      { name: 'Supplier', link: '/supplier/detail', image: '../../../assets/images/supplier-hamburger.svg', flag: permissionObj.supplierFlag },
      { name: 'My Materials', link: '/myMaterial', image: '../../../assets/images/supplier-hamburger.svg', flag: permissionObj.rfqFlag }

    ]

  }
}

export const API = {
  PROJECTS: (organizationId, userId) => `projects/${organizationId}/${userId}`,
  USERPROJECTS: `user/project`,
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
  POSTSUPPLIERDOCUMENTUPLOAD : `supplier/documents/upload`,
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
  GET25BOMTRADES: `topmaterial/get/trades`,
  ORGANIZATIONTRADES: projectId => `all/org/trades/${projectId}`,
  PROJECTTRADES: `add/projectTrades`,
  TERMS: id => `update/terms/${id}`,
  TURNOVERLIST: `get/turnovers`,
  VERIFYMOBILE: mobile => `verify/contact?contact=${mobile}`,
  VERIFYFORGETPASSWORDOTP: (phone, otp, clientId) => `api/auth/otp/verify?phone=${phone}&otp=${otp}&tokenRequired=true&client_id=${clientId}`,
  FORGOTPASSWORD: `api/user/resetPassword`,
  CHECKTERMS: `get/isuser/terms/accepted`,
  MATERIALUNIT: `material/get/unit`,
  MYCUSTOMMATERIAL: (type) => `material/get/custom/${type}`,
  DOWNLOADPO: purchaseOrderId => `po/download/${purchaseOrderId}`,
  TRADERELATEDCATEGORY: (tradeName) => `trade/get/categories/${tradeName}`,
  MATERIALEXIST: `material/search/materialexist`,
  ADDMYMATERIAL: projectId => `material/add/custom/${projectId}`,
  GETRELEASENOTES: `user/get/releaseNote`,
  UPDATEMYMATERIAL: `material/update/approved/custom`,
  APPROVEMYMATERIAL: `material/update/approve/custom`,
  SENDRELEASENOTE: `user/add/releaseNote`,
  DELETEMYMATERIAL: (id) => `material/delete/custom/${id}`,
  ALLCATEGORY: `trade/get/all/categories`
};
