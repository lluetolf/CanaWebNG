// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_URL = "http://127.0.0.1"

export const environment = {
  production: false,
  apiBaseUri: BASE_URL,
  apiAuthUrl: BASE_URL + ":31111",
  firebase: {
    apiKey: "AIzaSyDxNB0QvG8UKQDnc1s7ik7oqsg-0CdW758",
    authDomain: "dev-canaweb-firestore.firebaseapp.com",
    projectId: "dev-canaweb-firestore"
  }
};
