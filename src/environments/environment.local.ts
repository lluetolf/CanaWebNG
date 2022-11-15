// LOCAL

export const environment = {
  production: false,
  useEmulators: true,
  apiBaseUri: "http://localhost:9547/api",
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
