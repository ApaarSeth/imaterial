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
  RAISEINDENT: projectId => `indent/${projectId}`,
  DELETE: (organizationId, projectId) =>
    `deleteProject/${organizationId}/${projectId}`,
  GETMATERIALSWITHSPECS: `material/materialsSpecs`,
  GETMATERIALSWITHQUANTITY: (organizationId, projectId) =>
    `materials/${organizationId}/${projectId}`
  //STATE: 'account/api/permitted/address/states',
};
