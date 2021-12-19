// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_URL = "http://127.0.0.1"

export const environment = {
  production: false,
  apiBaseUri: BASE_URL,
  apiAuthUrl: BASE_URL + ":31111"
};
