# CanaWebNG

This project runs [Angular 15](https://https://angular.io/) and was generated with [Angular CLI](https://github.com/angular/angular-cli).

## TODO
- Footer needs content
- Dashboard requires a loading animation
- Relogin doesn't work on token expiry. 

## Local setup

1. Run the Firebase emulator.  
``firebase emulators:start``  
``run start-local``
2. Run the API (CanaWeb-Api)
3. Run CLI Server  
``CLI Server: run start-local``

## PROD
Local for testing: ``CLI Server run build --configuration=production``
Deploy: push to dev branch to trigger cloudbuild.


