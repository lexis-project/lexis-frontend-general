# Cypress tests

## Directories
The cypress tests can be run locally. Tests are located at
lexis-client/cypress/integration/

They can also be run as part of cicd. In that case, they are located at
integration-test/cypress/integration/
and listed in
integration-test/cypress/integration/flows.

Caveat: lexis-be/server.js will be run from integration-test/ in cicd,
so any resources (e.g. files) need to be available from that root. 

## Dataset tests

We use a common set of tests for both the front-end and the wp3 APIs.
The test description can be found at
https://adasoffice.vsb.cz/Products/Files/DocEditor.aspx?fileid=4235
