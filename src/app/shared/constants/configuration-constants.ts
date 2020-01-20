export const ConfigurationConstants = {
  HEADER_SKIP_LOADER: "Skip-Loader",
  HEADER_CACHE_REQUEST: "Cache-Request"
};
export const API = {
  PROJECTS: (organizationId, userId) => `projects/${organizationId}/${userId}`,
  GETPROJECT: (organizationId, projectId) =>
    `project/${organizationId}/${projectId}`,
  GETCATERGORY: `material/groups`,
  ADDPROJECT: `addProject`,
  UPDATEPROJECT: (organizationId, projectId) =>
    `updateProjectDetails/${organizationId}/${projectId}`,
  RAISEINDENT: projectId => `indent/${projectId}`,
  DELETE: (organizationId, projectId) =>
    `deleteProject/${organizationId}/${projectId}`,
  GETMATERIALSWITHSPECS: `material/materialsSpecs`,
  GETMATERIALSWITHQUANTITY: (organizationId, projectId) =>
    `materials/${organizationId}/${projectId}`,
  GETINDENTLIST: projectId => `indent/list/${projectId}`,
  POSTMATERIALSQUANTITY: (userId, projectId) =>
    `materials/${userId}/${projectId}`,
  GETMATERIALWISE: organizationId => `global/materials/${organizationId}`,
  GETPROJECTWISE: organizationId => `global/projects/${organizationId}`,
  RFQMATERIALS: `rfqMaterials`,
  RFQDETAIL: organizationId => `rfq/list/1`,
  RFQPO: (organizationId, rfqId) => `rfq/details/${organizationId}/${rfqId}`
  //STATE: 'account/api/permitted/address/states',
};
