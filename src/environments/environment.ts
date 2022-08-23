// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUri: "http://localhost:8080",
  firebase: {
    apiKey: "AIzaSyDxNB0QvG8UKQDnc1s7ik7oqsg-0CdW758",
    authDomain: "dev-canaweb-firestore.firebaseapp.com",
    projectId: "dev-canaweb-firestore"
  },
  release: {
    env: "_SB_ENV",
    buildTime: "_BUILD_TIME",
    commitSha: "_COMMIT_ID",
    branchName: "_BRANCH_NAME"
  }
}
