// PROD

export const environment = {
  production: true,
  useEmulators: false,
  apiBaseUri: "https://api.canaweb.app/api",
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
};
