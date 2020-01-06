export const ConfigurationConstants = {
  HEADER_SKIP_LOADER: "Skip-Loader",
  HEADER_CACHE_REQUEST: "Cache-Request"
};
export const API = {
  PROJECTS: (organizationId, userId) => `projects/${organizationId}/${userId}`,
  GETCATERGORY: `material/groups`,
  GETMATERIALSWITHSPECS: `material/MaterialsSpecs`,
  ADDPROJECT: `addProject`
  //STATE: 'account/api/permitted/address/states',
};
