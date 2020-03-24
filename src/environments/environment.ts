// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   url: "http://localhost:1323/im",
//   masterUrl: "http://localhost:1333/mm",
//   ssoUrl: "http://localhost:8080/sso",
//    debug_mode: true
// };

export const environment = {
  ga: "",
  production: false,
  url: "https://api.yeho.ga/im",
  masterUrl: "https://api.yeho.ga/mm",
  ssoUrl: "https://api.yeho.ga/sso",
  debug_mode: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
