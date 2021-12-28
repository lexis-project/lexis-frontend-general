var express = require("express")
var app = express()
var cors = require("cors")
var morgan = require('morgan')
const tus = require('tus-node-server')
const TUS_EVENTS = require('tus-node-server').EVENTS
const Crypto = require('crypto')
const formidable = require('formidable')

const _ = require('lodash')
var {
  list,
  users,
  projects,
  datasetsMetadataQueryResponse,
  dataset_staging_info,
  dataset_staging_stage,
  dataset_staging_datasize,
  dataset_staging_datasize_result,
  dataset_multipart,
  dataset_multipart_result,
  dataset_staging_stage_delete,
  dataset_staging_stage_result,
  dataset_stage_result_key,
  dataset_staging_stage_delete_result,
  dataset_sshfsexport,
  dataset_stored,
  dataset_deleted_stored,
  dataset_tusuploadloc,
  organizationId,
  hpcresources,
  dynamicResourcesSelection,
  workflowTemplates,
  workflowTemplatesDetail,
  workflows,
  workflowDetail,
  workflowExecutions,
  uuidv4,
  hpcResourceRequestsSentBackFromApproval,
  workflowExecutionDetail,
  workflowExecutionLogs,
  usageManagementProjectsArray,
  hpcApprovedResourceRequestsSentBackFromApproval,
  workflowExecutionStepStatus,
  workflowExecutionStatus,
  projectUsers,
  listOfHPCresources,
  userPermissions,
  getDatasetFiles,
  organizationID,
  availableClusters
} = require("./mock-data")

var bodyParser = require("body-parser")
app.use(bodyParser.json({limit: '200mb'})) // support json encoded bodies; support upload
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.use(cors()) //enable cors

// adding morgan to log HTTP requests
app.use(morgan('combined'))

// Dataset GET size req id store
const DSsizeKeyStore = {}
const DSDeleteKeyStore = {}
const DSStageDeleteKeyStore = {}

// Dataset assign new pid request
const DSassignPIDKeyStore = {}

// Datasets duplicate, replicate - stores for assigning request_id
const DSreplicateKeyStore = {}
const DSduplicateKeyStore = {}

// setup tus fake server
const tusServer = new tus.Server()
tusServer.datastore = new tus.FileStore({
  path: '/tusTMP'
})
tusServer.on(TUS_EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
  console.log(`TUS - upload complete for file ${event.file.id}`);
});
const uploadApp = express()
uploadApp.all('*', tusServer.handle.bind(tusServer))
app.use('/api/v0.2/dataset/upload/', uploadApp)

app.listen(3001, () => {
  console.log("Server running on port 3001")
})

/* AUTH */
var authenticated = process.env.NODE_ENV==="staging";
var token = "";
var loggedUser = null;

const authorize = (reqToken, inToken) =>{
  if (process.env.NODE_ENV==="staging") {
    return true
  } else {
    console.log(reqToken)
    console.log(inToken)
//    console.trace();
    return reqToken === `Bearer ` + inToken
  }
}

if (process.env.NODE_ENV==="staging") {
  loggedUser = {
    ID: uuidv4(),
    FirstName: "math",
    LastName: "engineer",
    EmailAddress: "engineer@vsb.cz",
    OrganizationID: process.env.ASSIGNED_TO_ORG ? organizationID : "", // organizationId
    Username: "mathen",
    AllowedOrganizations: process.env.ALLOWED_ORGS ?
    [
       "8dd5za7f-c274-4b63-812a-3c4026d0138d",
       "8dd5ia7f-c274-4b63-812a-3c4026d0138d"
     ] : undefined,
    Projects: ['LEXIS_ID_2','LEXIS_ID_1']
  }
  users.push(loggedUser);
}

console.log("\loggedUser\n:::", loggedUser)

app.get("/auth/session-info", (req, res) => {
  if (authenticated === true) {
    res
      .status(200)
      .json({
        authenticated: authenticated,
        token: token,
        auth: {
          username: loggedUser.Username,
          firstname: loggedUser.FirstName,
          lastname: loggedUser.LastName,
          email: loggedUser.EmailAddress,
          emailverified: false,
          id: loggedUser.ID,
          // role: "lex_adm" // or "org_mgr" and more
          role: process.env.NODE_ENV==="staging" && process.env.USER_ROLE? process.env.USER_ROLE : "lex_adm" /*"end_usr"*/,
          Permissions: userPermissions,
          AllowedOrganizations: process.env.ALLOWED_ORGS ?
          [
             "8dd5za7f-c274-4b63-812a-3c4026d0138d",
             "8dd5ia7f-c274-4b63-812a-3c4026d0138d"
           ] : undefined,
        }
        //"auth":{"id":"","username":"","email":"","emailverified":false,"firstname":"","lastname":"","role":"","organization":"","projects":null,"ddi-projects":null,"Token":"","Permissions":{}}
      })
      .end();
  } else {
    res
      .status(200)
      .json({ authenticated: authenticated })
      .end();
  }
});

console.log("\nuserPermissions\n:::", userPermissions)

app.get("/auth/login", (req, res) => {
  res.send(
    "Put <a href=\"http://localhost:3001/auth/login/12345\" target=\"_blank\">login</a> into browser where 12345 is your token"
  );
});

app.get("/auth/login/:token", (req, res) => {
  token = req.params.token;
  authenticated = true;

  loggedUser = {
    ID: uuidv4(),
    FirstName: "math",
    LastName: "engineer",
    EmailAddress: "engineer@vsb.cz",
    OrganizationID: "", // organizationId
    Username: "mathen"
  }
  users.push(loggedUser);

  console.log(
    "\n========SERVER INFO:========",
    "\nUser logged in:\n----------------------------",
    "\nWith token:  ", token,
    "\nWith ID:  ", loggedUser.ID,
    "\n============================"
  )

  res.send(
    "You are logged in with token: " +
    token +
    ' now go to <a href="http://localhost:3000">http://localhost:3000</a>'
  );
});

app.post("/auth/logout", (req, res) => {
  authenticated = false;
  token = "";
  loggedUser = null;
  res.json({ loggedout: true });
});

app.get("/auth/loggedout", (req, res) => {
  res.send("Logged out successful");
});

/* DATASETS */

app.post("/api/v0.2/dataset/search/metadata", (req, res) => {
  if (datasetsMetadataQueryResponse.length == 5) {
    // just insert 5 datasets to test internal server error
    res.status(500).end()
  } else {
    if (authorize(req.headers.authorization, token)) {
      //implement filtering
      let rdatasets
      if (req.body.Title !== undefined)
        rdatasets = datasetsMetadataQueryResponse.filter(
          (e) => e.metadata.title.search(req.body.Title) !== -1
        )
      else if (req.body.internalID !== undefined)
        rdatasets = datasetsMetadataQueryResponse.filter(
          (e) => e.location.internalID === req.body.internalID
        )
      else rdatasets = datasetsMetadataQueryResponse
      //just filter by title for now

      setTimeout(()=>res.status(200).json(rdatasets), 2000)
    } else {
      res.status(401).json({ errorString: "Invalid Authorization" })
    }
  }
})

app.delete("/api/v0.2/dataset/search/metadata", (req, res) => {
  if (datasetsMetadataQueryResponse.length == 5) {
    // just insert 5 datasets to test internal server error
    res.status(500).end();
  } else {
    if (authorize(req.headers.authorization, token)) {
      res.status(204).end();
    } else {
      res.status(401).json({errorString: "Invalid Authorization"});
    }
  }
});


app.post("/api/v0.2/dataset/listing", (req, res) => {
  if (datasetsMetadataQueryResponse.length == 5) {
    // just insert 5 datasets to test internal server error
    res.status(500).end();
  } else {
    if (authorize(req.headers.authorization, token)) {
      res.status(200).json(getDatasetFiles());
    } else {
      res.status(401).json({errorString: "Invalid Authorization"});
    }
  }
});
/** variable is used to send random image*.zip dataset content archive with image
 */
let cyclingDatasetFiles=0

app.post("/api/v0.2/dataset/download", (req, res) => {
  if (datasetsMetadataQueryResponse.length == 5) {
    console.log ("/dataset/download status 500")
    // just insert 5 datasets to test internal server error
    res.type('application/json').status(500).json({errorString: 'Error example'});
  } else {
    if (authorize(req.headers.authorization, token)) {
        if( req.body.archivetype === 'file'){
          res.type("application/octet-stream").status(200).sendFile("files/Lorem.txt", {root: "."})
        } else if(req.body.path.includes('wrf/script.py')){
          console.log('sending python script')
          res.type("application/octet-stream").status(200).sendFile("files/datasetWithPython.zip", {root: "."});
        } else if (req.body.path!==undefined) {
           res.type("application/octet-stream").status(200).sendFile("files/image"+cyclingDatasetFiles+".zip", {root: "."});
           cyclingDatasetFiles=(cyclingDatasetFiles+1)%10
        } else {
           res.type("application/octet-stream").status(200).sendFile("files/dataset.zip", {root: "."});
        }
    } else {
      res.status(401).json({errorString: "Invalid Authorization"});
    }
  }
});

app.post("/api/v0.2/dataset/staging/stage", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
                res.status(201).json(dataset_staging_stage);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

app.post("/api/v0.2/dataset/staging/data/size", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
                res.status(201).json(dataset_staging_datasize);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

app.get("/api/v0.2/dataset/staging/data/size/:id", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
                res.status(200).json(dataset_staging_datasize_result);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

app.post("/api/v0.2/dataset/compress/zip", (req, res) => {
       res.status(201).json(dataset_multipart);
});

app.get("/api/v0.2/dataset/compress/zip/:id", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
            res.status(200).json(dataset_multipart_result);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});


app.post("/api/v0.2/dataset/staging/download", (req, res) => {
       res.status(200).sendFile("files/dataset.zip", {root: "."});
});

app.get("/api/v0.2/dataset/staging/stage/:id", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
//Users may upload their own datasets, so always return our stored dataset instead, except for multipart
//                res.status(200).json(dataset_staging_stage_result[req.params.id]);
		  res.status(200).json(dataset_staging_stage_result[dataset_stage_result_key]);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

app.get("/api/v0.2/dataset/staging/info", (req, res) => {
	if (authorize(req.headers.authorization, token)) {
		res.status(200).json(dataset_staging_info);
	} else {
		res.status(401).json({errorString: "Invalid Authorization"});
	}
});

app.delete("/api/v0.2/dataset/staging/delete", (req, res) => {
    if (authorize(req.headers.authorization, token)) {
      const splittedPath = req.body.target_path.split("/")
      const dsPath = splittedPath[splittedPath.length-1]
      const dsIndex = datasetsMetadataQueryResponse.findIndex(
        (ds) => ds.location.internalID == dsPath
      )
      if(dsIndex !== -1) {
      let reqID = generateHash256()
      while(!!DSStageDeleteKeyStore[reqID]){ // check uniq
        reqID = generateHash256()
      }

      setTimeout(()=>{
        DSStageDeleteKeyStore[reqID] = true
      }, 15000)

      res.status(200).json({request_id: reqID})
    } else {
      res.status(403).json({errorString: "Unauthorized or does not exists"})
    }
    } else {
      res.status(500).send("Invalid token")
    }
  })

  app.get("/api/v0.2/dataset/staging/delete/:request_id", (req, res) => {
    if (authorize(req.headers.authorization, token)) {
      let resBody = {}
      if(DSStageDeleteKeyStore[req.params.request_id]) {
        resBody = {
          result: "Done",
        }
        delete DSStageDeleteKeyStore[req.params.request_id]
      } else {
        resBody = {
          result: "Task still in the queue, or task does not exist",
        }
      }
      res.status(200).json(resBody)
    } else {
      res.status(500).send("Invalid token")
    }
  })

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function randomString() {
    charSet = 'abcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < 10; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

app.post("/api/v0.2/dataset/ssh/sshfsexport", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
                var u=randomString()
                dataset_sshfsexport.push({"user": u, "path": req.body.path, "sshfs": u+"@lexis-test.srv.lrz.de:"})
                res.status(201).json(dataset_sshfsexport[dataset_sshfsexport.length-1]);
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }

});


app.delete("/api/v0.2/dataset/ssh/sshfsexport", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
                var u=req.body.user
                var i=dataset_sshfsexport.findIndex((e) => e.user == u)
                dataset_sshfsexport.forEach((e)=> console.log(e))
                if (i==-1)
                   res.status(404).json({"errorString": "ssh export not found"})
                else {
                   dataset_sshfsexport.splice (i, 1)
                   res.status(204).end()
                }
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }

});

//gridmap
app.post("/api/v0.2/dataset/gridftp/gridmap", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
            res.status(201).end()
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

app.delete("/api/v0.2/dataset/gridftp/gridmap", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
            res.status(204).end()
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

// Create new dataset
app.post("/api/v0.2/dataset", (req, res) => {
        if (authorize(req.headers.authorization, token)) {
               if (req.body.internalID===undefined) {
                   var newd={"eudat": {}, "location": {"access": req.body.access, "project": req.body.project,
			"internalID": uuidv4()},
                              "metadata": {            "AlternateIdentifier": [],
            "CustomMetadataSchema": [],
            "contributor": [
            ],
            "creator": [
            ],
            "owner": [],
            "publisher": [
            ],
            "relatedIdentifier": [],
            "resourceType": req.body.metadata && req.body.metadata.resourceType,
            "rights": [],
            "rightsIdentifier": [],
            "rightsURI": [],
            "title": req.body.metadata.title,
            "publicationYear": req.body.metadata && req.body.metadata.publicationYear,
            "customMetadata": req.body.metadata && req.body.metadata.customMetadata
        }}
                   datasetsMetadataQueryResponse.push(newd)
                   res.status(200).json({"internalID": newd.location.internalID, "status":"200"});
               } else {
                    var i=datasetsMetadataQueryResponse.findIndex (e => e.location.internalID === req.body.internalID)
                    if (i===-1) {
                       res.status(403).json({"errorString": "User does not have permission to access dataset, or dataset does not exist"})
                    } else {
                      if (req.body.metadata!==undefined) {
                       if (req.body.metadata.resourceType !== undefined)
				{datasetsMetadataQueryResponse[i].metadata.resourceType=req.body.metadata.resourceType}
                       if (req.body.metadata.title!== undefined) {datasetsMetadataQueryResponse[i].metadata.title=req.body.metadata.title}
                       if (req.body.metadata.publicationYear!== undefined)
				{datasetsMetadataQueryResponse[i].metadata.publicationYear=req.body.metadata.publicationYear}
                       if (req.body.metadata.customMetadata!== undefined)
				{datasetsMetadataQueryResponse[i].metadata.customMetadata=req.body.metadata.customMetadata}
                      }
                      res.status(200).json({"internalID": req.body.internalID, "status":"200"});
                    }
               }
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }

});


app.delete("/api/v0.2/dataset", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const dsPath = req.body.source_path.split("/")[2]
    const dsIndex = datasetsMetadataQueryResponse.findIndex(
      (ds) => ds.location.internalID == dsPath
    )
    if(dsIndex !== -1) {
    let reqID = generateHash256()
    while(!!DSDeleteKeyStore[reqID]){ // check uniq
      reqID = generateHash256()
    }

    setTimeout(()=>{
      DSDeleteKeyStore[reqID] = true
    }, 15000)

    res.status(200).json({request_id: reqID})
  } else {
    res.status(403).json({errorString: "Unauthorized or does not exists"})
  }
  } else {
    res.status(500).send("Invalid token")
  }
})

app.get("/api/v0.2/dataset/:request_id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let resBody = {}
    if(DSDeleteKeyStore[req.params.request_id]) {
      resBody = {
        result: "Done",
      }
      delete DSDeleteKeyStore[req.params.request_id]
    } else {
      resBody = {
        result: "Task still in the queue, or task does not exist",
      }
    }
    res.status(200).json(resBody)
  } else {
    res.status(500).send("Invalid token")
  }
})

app.post("/api/v0.2/dataset/upload/", (req, res) => {
      if (authorize(req.headers.authorization, token)) {

          fs.readdir(server.datastore.path, (err, files)=>{
            console.log('TUS files:', files)
            res.status(200).send('OK')
          })
      } else {
              res.status(401).json({errorString: "Invalid Authorization"});
      }
})

app.patch("/api/v0.2/dataset/upload/", (req, res) => {
        if ( authorize(req.headers.authorization, token)) {
          res.status(204).end()
        } else {
                res.status(401).json({errorString: "Invalid Authorization"});
        }
});

function generateHash256(){
  return Crypto.createHash('sha256').update(Math.random().toString(36)).digest('hex')
}

app.post("/api/v0.2/dataset/data/size", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const dsPath = req.body.target_path.split("/")[2]
    const dsIndex = datasetsMetadataQueryResponse.findIndex(
      (ds) => ds.location.internalID == dsPath
    )

    let reqID = generateHash256()
    while(!!DSsizeKeyStore[reqID]){ // if this random hash already exists, it gets new one
      reqID = generateHash256()
    }

    setTimeout(()=>DSsizeKeyStore[reqID] = datasetsMetadataQueryResponse[dsIndex].size, 2000)

    res.status(201).json({request_id: reqID})
  } else {
    res.status(500).send("Invalid token")
  }
})

app.get("/api/v0.2/dataset/data/size/:request_id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let resBody = {}
    if(DSsizeKeyStore[req.params.request_id]) {
      resBody = {
        result: "Done",
        size: DSsizeKeyStore[req.params.request_id],
        totalfiles: "" + Math.ceil(Math.random() * 25000),
        smallfiles: "" + Math.ceil(Math.random() * 500),
      }
      delete DSsizeKeyStore[req.params.request_id]
    } else {
      resBody = {
        result: "Task still in the queue, or task does not exist",
      }
    }
    res.status(200).json(resBody)
  } else {
    res.status(500).send("Invalid token")
  }
})


app.post("/api/v0.2/dataset/PID/assign", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const dsPath = req.body.source_path.split("/")[2]
    const dsIndex = datasetsMetadataQueryResponse.findIndex(
      (ds) => ds.location.internalID == dsPath && ds.eudat.PID === req.body.parent_pid
    )
    if(dsIndex !== -1) {
    let reqID = generateHash256()
    while(!!DSassignPIDKeyStore[reqID]){ // check uniq
      reqID = generateHash256()
    }

    let newPID = '1.2351/' + generateHash256()
    while(!!datasetsMetadataQueryResponse.find( dat => dat.eudat.PID === newPID)) {
      newPID = '1.2351/' + generateHash256()
    }

    setTimeout(()=>{
      DSassignPIDKeyStore[reqID] = newPID
      datasetsMetadataQueryResponse[dsIndex].eudat.PID = newPID
    }, 15000)

    res.status(201).json({request_id: reqID})
  } else {
    res.status(403).json({errorString: "Unauthorized or does not exists"})
  }
  } else {
    res.status(500).send("Invalid token")
  }
})

app.get("/api/v0.2/dataset/pid/:request_id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let resBody = {}
    if(DSassignPIDKeyStore[req.params.request_id]) {
      resBody = {
        result: "Done",
        PID: DSassignPIDKeyStore[req.params.request_id],

      }
      delete DSsizeKeyStore[req.params.request_id]
    } else {
      resBody = {
        result: "Task still in the queue, or task does not exist",
      }
    }
    res.status(200).json(resBody)
  } else {
    res.status(500).send("Invalid token")
  }
})

// endpoints for dataset replication
app.post("/api/v0.2/dataset/replicate", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const dsID = req.body.source_path.split("/")[2]
    const target_system = req.body.target_system
    const target_path = req.body.target_path

    const dsIndex = datasetsMetadataQueryResponse.findIndex(
      (ds) => ds.location.internalID == dsID
    )
    const pid = datasetsMetadataQueryResponse[dsIndex].eudat.PID

    let reqID = generateHash256()
    while(!!DSreplicateKeyStore[reqID]){ // if this random hash already exists, it gets new one
      reqID = generateHash256()
    }

    DSreplicateKeyStore[reqID] = {}

    DSreplicateKeyStore[reqID].status = "Replication completed"
    DSreplicateKeyStore[reqID].PID = pid
    DSreplicateKeyStore[reqID].target_path = "/" + target_system + "/" + target_path

    res.status(201).json({request_id: reqID})
  } else {
    res.status(500).send("Invalid token")
  }
})

app.get("/api/v0.2/dataset/replicate/:request_id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let resBody = {}
    if(DSreplicateKeyStore[req.params.request_id]) {
      resBody = {
        status: DSreplicateKeyStore[req.params.request_id].status,
        PID: DSreplicateKeyStore[req.params.request_id].PID,
        target_path: DSreplicateKeyStore[req.params.request_id].target_path
      }
      delete DSreplicateKeyStore[req.params.request_id]
    } else {
      resBody = {
        result: "Task still in the queue, or task does not exist",
      }
    }
    res.status(200).json(resBody)
  } else {
    res.status(500).send("Invalid token")
  }
})

// endpoints for dataset duplication
app.post("/api/v0.2/dataset/duplicate", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const target_system = req.body.target_system
    const target_path = req.body.target_path

    let reqID = generateHash256()
    while(!!DSduplicateKeyStore[reqID]) { // if this random hash already exists, it gets new one
      reqID = generateHash256()
    }

    DSduplicateKeyStore[reqID] = {}


    DSduplicateKeyStore[reqID].status = "Duplication completed"
    DSduplicateKeyStore[reqID].target_path = "/" + target_system + "/" + target_path


    res.status(201).json({request_id: reqID})
  } else {
    res.status(500).send("Invalid token")
  }
})

app.get("/api/v0.2/dataset/duplicate/:request_id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let resBody = {}
    if(DSduplicateKeyStore[req.params.request_id]) {
      resBody = {
        status: DSduplicateKeyStore[req.params.request_id].status,
        target_path: DSduplicateKeyStore[req.params.request_id].target_path
      }
      delete DSduplicateKeyStore[req.params.request_id]
    } else {
      resBody = {
        result: "Task still in the queue, or task does not exist",
      }
    }
    res.status(200).json(resBody)
  } else {
    res.status(500).send("Invalid token")
  }
})

/*rgh: add all api calls here */
/* ORGANIZATIONS */

app.get("/api/v0.2/organization", (req, res) => {
  if (list.length == 5) {
    // just insert 5 organizations to test internal server error
    res.status(500).end();
  } else {
    if (authorize(req.headers.authorization, token)) {
      res.status(200).json(list);
    } else {
      res.status(500).send("Invalid token");
    }
  }
});

app.get("/api/v0.2/organization/:id", function(req, res) {
  console.log('list', list)
  if (authorize(req.headers.authorization, token)) {
    let result = list.find(function(element) {
      return element.ID == req.params.id;
    });
    if (result == null) {
      res.status(406).end();
    } else {
      res.status(200).json(result);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

app.post("/api/v0.2/organization", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    list.push({
      ID: organizationID,
      FormalName: req.body.FormalName,
      RegisteredAddress1: req.body.RegisteredAddress1,
      RegisteredAddress2: req.body.RegisteredAddress2,
      RegisteredAddress3: req.body.RegisteredAddress3,
      RegisteredCountry: req.body.RegisteredCountry,
      CreationDate: Date.now(),
      CreatedBy: req.body.CreatedBy,
      Website: req.body.Website,
      OrganizationEmailAddress: req.body.OrganizationEmailAddress,
      PrimaryTelephoneNumber: req.body.PrimaryTelephoneNumber
    });
    users.find(({ID}) => ID === loggedUser.ID).OrganizationID = organizationID
    res.status(201).end();
  } else {
    res.status(500).send("Invalid token");
  }
});

app.put("/api/v0.2/organization/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let result = list.find(function(element) {
      return element.ID == req.params.id;
    });
    if (result == null) {
      res.status(406).end();
    } else {
      let newList = list.filter(function(value, index, arr) {
        return value.ID != req.params.id;
      });

      newList.push({
        ID: result.ID,
        FormalName: req.body.FormalName,
        RegisteredAddress1: req.body.RegisteredAddress1,
        RegisteredAddress2: req.body.RegisteredAddress2,
        RegisteredAddress3: req.body.RegisteredAddress3,
        RegisteredCountry: req.body.RegisteredCountry,
        CreationDate: Date.now(),
        CreatedBy: req.body.CreatedBy,
        Website: req.body.Website,
        OrganizationEmailAddress: req.body.OrganizationEmailAddress,
        PrimaryTelephoneNumber: req.body.PrimaryTelephoneNumber
      });

      list = newList;

      res.status(200).end();
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

app.delete("/api/v0.2/organization/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const length = list.length;

    list = list.filter(
      organization => organization.ID !== parseInt(req.params.id, 10)
    );

    if (length === list.length) {
      res.sendStatus(406);
    } else {
      res.sendStatus(200);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

/* USERS */

app.get("/api/v0.2/user", function(req, res) {
  if (authorize(req.headers.authorization, token)) {
    console.log(`req.query.project !== undefined`, req.query.project !== undefined, users)
      if(req.query.project !== undefined) {
        let filtered = users.filter((user) => user.Projects && user.Projects.includes(req.query.project))
        if(req.query.permissions === undefined)
          {filtered = filtered.map((user)=>_.omit(user, 'Permissions'))}
        res.status(200).json(filtered)
      } else {res.status(200).json(users);}
  } else {
    res.status(500).send("Invalid token");
  }
});

app.get("/api/v0.2/user/:id", function(req, res) {
  if (authorize(req.headers.authorization, token)) {
    
    let result = users.find(function(element) {
    console.log("element.ID ::::", element.ID)
    console.log("req.params.id ::::", req.params.id)
      return element.ID == req.params.id;
    });
    
    if (result == null) {
      res.status(406).end();
    } else {
      res.status(200).json(result);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

app.post("/api/v0.2/user", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const userID = uuidv4();
    users.push({
      ID: userID,
      OrganizationID: organizationID,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      EmailAddress: req.body.EmailAddress,
      Username: req.body.Username,
    });
    let link =
      "https://portal.lexis.tech/" +
      userID;

    const last = users.slice(-1)
    const lastUsername = last[0].Username

    res.status(201).json({
      ID: userID,
      Link: link,
      Username: lastUsername
    });
  } else {
    res.status(500).send("Invalid token");
  }
});

app.put("/api/v0.2/user/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let result = users.find(function(element) {
      return element.ID == req.params.id;
    });
    if (result == null) {
      res.status(406).end();
    } else {
      let newUsers = users.filter(function(value, index, arr) {
        return value.ID != req.params.id;
      });

      newUsers.push({
        ...result,
        ...req.body
      });

      users = newUsers;
      res.status(200).end();
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

app.delete("/api/v0.2/user/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const length = users.length;
    users = users.filter(users => users.ID !== req.params.id);

    if (length === users.length) {
      res.sendStatus(406);
    } else {
      res.sendStatus(200);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

/* PROJECTS */

// list all projects (GET)
app.get("/api/v0.2/project", (req, res) => {
    if (authorize(req.headers.authorization, token)) {
      res.status(200).json(projects)
    } else {
      res.status(500).send("Invalid token")
    }
})

// individual project (GET)
app.get("/api/v0.2/project/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let result = projects.find(function(element) {
      return element.ProjectID == req.params.id
    })
    if (result == null) {
      res.status(406).end()
    } else {
      console.log(
        "list one projects\n===========================",
        result,
        "\n==========================="
      )
      res.status(200).json(result)
    }
  } else {
    res.status(500).send("Invalid token")
  }
})

app.put("/api/v0.2/project/:id/user/:userID", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let result = users.find(function(element) {
      return element.ID == req.params.userID;
    });
    if (result == null) {
      res.status(406).end();
    } else {
      let user = users.find(function(element) {
        return element.ID === req.params.userID;
      });

      if (user.Projects instanceof Array){
        user.Projects.push([req.params.id])
      }else{
        user.Projects = [req.params.id]
      }

      res.status(200).end();
    }
  } else {
    res.status(500).send("Invalid token");
  }
})

// create project (POST)
app.post("/api/v0.2/project", (req, res) => {
  if (authorize(req.headers.authorization, token)) {

    if (req.body.ProjectShortName == "lexis_project") {
      res.status(422).send('INVALID_PROJECT_SHORT_NAME').end();
    } else {
      var prjUuid = `LEXIS_ID_${projects.length + 1}` 
      
      projects.push({
        ProjectID: prjUuid,
        ProjectName: req.body.ProjectName,
        ProjectDescription: req.body.ProjectDescription,
        ProjectCreationTime: Date.now(),
        ProjectCreatedBy: req.body.ProjectCreatedBy,
        LinkedOrganization: req.body.LinkedOrganization,
        ProjectStatus: req.body.ProjectStatus,
        ProjectContactPerson: req.body.ProjectContactPerson,
        ProjectContactEmail: req.body.ProjectContactEmail,
        ProjectStartDate: req.body.ProjectStartDate,
        ProjectTerminationDate: req.body.ProjectTerminationDate,
        ProjectMaxPrice: 0,
        NormCoreHours: 0,
        ProjectDomain: req.body.ProjectDomain,
        ProjectShortName: req.body.ProjectShortName
      })
      const user = users.find((user)=>user.ID === loggedUser.ID)
      user.Projects.push(prjUuid)
      // add new project into usageManagement (with empty HPC Projects)
      usageManagementProjectsArray.push({
        ProjectID: `LEXIS_ID_${projects.length}`,
        ProjectName: req.body.ProjectName,
        HPCProjects: [],
      })
    }

    if (process.env.NODE_ENV =="staging" && process.env.USER_ROLE == "org_mgr") {
      userPermissions.prj_list.push({
        ORG_UUID: req.body.LinkedOrganization,
        PRJ: req.body.ProjectShortName,
        PRJ_UUID: prjUuid,
      })

      userPermissions.prj_read.push({
        ORG_UUID: req.body.LinkedOrganization,
        PRJ: req.body.ProjectShortName,
        PRJ_UUID: prjUuid,
      })

      userPermissions.prj_write.push({
        ORG_UUID: req.body.LinkedOrganization,
        PRJ: req.body.ProjectShortName,
        PRJ_UUID: prjUuid,
      })
    }

    res.status(201).json({ID: prjUuid, Link: `/api/v0.2/project/${prjUuid}`}).end()
  } else {
    res.status(500).send("Invalid token")
  }
})

// update existing project (PUT)
app.put("/api/v0.2/project/:id", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let result = projects.find(function(element) {
      return element.ProjectID == req.params.id
    })
    if (result == null) {
      res.status(406).end()
    } else {
      let projectsNew = projects.filter(val => val.ProjectID != req.params.id)

      projectsNew.push({
        ProjectID: result.ProjectID,
        ProjectName: req.body.ProjectName,
        ProjectDescription: req.body.ProjectDescription,
        ProjectCreationTime: result.ProjectCreationTime,
        ProjectCreatedBy: result.ProjectCreatedBy,
        LinkedOrganization: result.LinkedOrganization,
        ProjectStatus: result.ProjectStatus,
        ProjectContactPerson: result.ProjectContactPerson,
        ProjectContactEmail: req.body.ProjectContactEmail,
        ProjectStartDate: req.body.ProjectStartDate,
        ProjectTerminationDate: req.body.ProjectTerminationDate,
        ProjectMaxPrice: result.ProjectMaxPrice,
        NormCoreHours: result.NormCoreHours,
        ProjectDomain: req.body.ProjectDomain,
      })
      projects = projectsNew

      res.status(200).end()
    }
  } else {
    res.status(500).send("Invalid token")
  }
})

/* HPC RESOURCES */

// GET listing resources (APPROVED already) of particular project sent back from Lexis Portal API
/*
app.get("/api/v0.2/project/:projectId/hpcresources", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    if (hpcresources.length == 7) {
      // just insert 7 hpcresources to test internal server error
      res.status(500).end();
    } else {
      res.status(200).json(hpcresources);
    }
  } else {
    res.status(500).send("Invalid token");
  }
})
*/

// GET listing DYNAMIC resources REQUESTS of particular project sent back from Approval API
app.get("/api/v0.2/approval_system/projectResourceRequest/:lexisProjectID", function(req, res) {
  if (authorize(req.headers.authorization, token)) {
    let result = hpcResourceRequestsSentBackFromApproval.filter(el => el.LEXISProjectID == req.params.lexisProjectID);

    if (result == null) {
      res.status(406).end();
    } else {
      res.status(200).json(result);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

// FIXME POST create already APPROVED resource (aka "HPCResource" in API's Swagger definition, not belonging to Approval system management)
/*
app.post("/api/v0.2/hpc/resource", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    hpcresources.push({
      HPCResourceID: uuidv4(),
      AssociatedLEXISProject: req.body.AssociatedLEXISProject,
      HPCProvider: req.body.HPCProvider,
      ResourceType: req.body.ResourceType,
      AssociatedHPCProject: req.body.AssociatedHPCProject,
      TermsConsent: req.body.TermsConsent
    })
    res.status(201).end()
  } else {
    res.status(500).send("Invalid token")
  }
})
*/

// POST create DYNAMIC resource REQUEST (aka "HPC resources from approval system")
app.post("/api/v0.2/approval_system/resourceRequest", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    hpcResourceRequestsSentBackFromApproval.push({
      HPCResourceRequestID: uuidv4(),
      LEXISProjectID: req.body.LEXISProjectID,
      LEXISProjectName: req.body.LEXISProjectName,
      ProjectContactEmail: req.body.ProjectContactEmail,
      PrimaryInvestigator: req.body.PrimaryInvestigator,
      CoreHoursExpected: req.body.CoreHoursExpected,
      Budget: req.body.Budget,
      DateStart: req.body.DateStart,
      DateEnd: req.body.DateEnd,
      ApprovalStatus: req.body.ApprovalStatus,
      Resources: req.body.Resources,
      TermsConsent: req.body.TermsConsent
    })
    console.log(hpcResourceRequestsSentBackFromApproval)
    res.status(201).end()
  } else {
    res.status(500).send("Invalid token")
  }
})

/* DYNAMIC RESOURCES - LISTING POSSIBLE SELECTION SENT FROM API */
app.get("/api/v0.2/approval_system/resource", function(req, res) {
  if (authorize(req.headers.authorization, token)) {
    res.status(200).json(dynamicResourcesSelection);
  } else {
    res.status(500).send("Invalid token");
  }
});

/* RESOURCES REQUESTS */

// GET specific DYNAMIC resources request by its ID
app.get("/api/v0.2/approval_system/resourceRequest/:HPCResourceRequestID", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const resourcesRequestById = hpcResourceRequestsSentBackFromApproval.find(resourcesRequest => resourcesRequest.HPCResourceRequestID == req.params.HPCResourceRequestID);

    if (!resourcesRequestById) {
      res.status(406).end();
    } else {
      res.status(200).json(resourcesRequestById);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

// GET specific resources request by its ID
app.get("/api/v0.2/approval_system/resourceRequest/:HPCResourceRequestID", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const resourcesRequestById = hpcResourceRequestsSentBackFromApproval.find(resourcesRequest => resourcesRequest.HPCResourceRequestID == req.params.HPCResourceRequestID);

    if (!resourcesRequestById) {
      res.status(406).end();
    } else {
      res.status(200).json(resourcesRequestById);
    }
  } else {
    res.status(500).send("Invalid token");
  }
});

// endpoint to get core spent hours aka "usageManagement - Actions relating to management of Cyclops usage"
app.get("/api/v0.2/accounting/:lexisProjectID/usage", function(req, res) {
  if (authorize(req.headers.authorization, token)) {
    let lexisProjectID = req.params.lexisProjectID;

    let projectAccountingData = usageManagementProjectsArray.find(item => item.ProjectID == lexisProjectID);

    res.status(200).send(projectAccountingData);
  } else {
    res.status(500).send("Invalid token");
  }
});

/* APPROVED RESOURCES REQUESTS */

// GET listing APPROVED resource REQUESTS of particular project sent back from Approval-System API (approval-system-interface)
app.get(
  "/api/v0.2/approval_system/projectApprovedResourceRequest/:LEXISProjectID",
  function (req, res) {
    if (authorize(req.headers.authorization, token)) {
      let result = hpcApprovedResourceRequestsSentBackFromApproval.filter(
        (item) => item.LEXISProjectID == req.params.LEXISProjectID
      )

      res.status(200).json(result)
    } else {
      res.status(500).send({errorString: "unexpected error"}).end()
    }
  }
)

// POST create APPROVED resource REQUEST for particular project to Approval-System API (approval-system-interface)
app.post("/api/v0.2/approval_system/approvedResourceRequest", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    hpcApprovedResourceRequestsSentBackFromApproval.push({
      ApprovalObjections: "",
      ApprovalStatus: "PENDING",
      HPCProjectID: req.body.HPCProjectID,
      HPCResourceID: hpcApprovedResourceRequestsSentBackFromApproval.length,
      LEXISProjectID: req.body.LEXISProjectID,
      LEXISProjectName: req.body.LEXISProjectName,
      ProjectContactEmail: req.body.ProjectContactEmail,
      TermsConsent: req.body.TermsConsent,
      HPCProvider: req.body.HPCProvider
    })
    res.status(201).end()
  } else {
    res.status(500).send({errorString: "unexpected error"}).end()
  }
})

// GET specific APPROVED resources request by its ID sent back from Approval-System API (approval-system-interface)
app.get(
  "/api/v0.2/approval_system/approvedResourceRequest/:HPCResourceId",
  function (req, res) {
    if (authorize(req.headers.authorization, token)) {
      let result = hpcApprovedResourceRequestsSentBackFromApproval.find(
        (item) => item.HPCResourceID == req.params.HPCResourceId
      )

      res.status(200).json(result)
    } else {
      res.status(500).send({errorString: "unexpected error"}).end()
    }
  }
)

/* WORKFLOWTEMPLATES */
app.get("/api/v0.2/workflow/template", function(req, res) {
    if (authorize(req.headers.authorization, token)) {
        if (workflowTemplates.length == 5) {
            // just insert 5 workFlow templates to test internal server error
            res.status(500).end();
        } else {
            res.status(200).json(workflowTemplates);
        }
    } else {
        res.status(500).send("Invalid token");
    }
});

app.get("/api/v0.2/workflow/template/:workflowTemplateId", function(req, res) {
    if (authorize(req.headers.authorization, token)) {
        let result = workflowTemplatesDetail.find(function(element) {
                  return element.workflowTemplateID == req.params.workflowTemplateId;

        });
        if (result == null) {
                  res.status(404).end();

        } else {
                  res.status(200).json(result);

        }

    } else {
            res.status(500).send("Invalid token");

    }

});

app.post("/api/v0.2/workflow/template/upload", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
      let form = formidable({ multiples: true });

      form.parse(req, function(err, fields, files) {
         Object.values(files).forEach(function(file) {
             workflowTemplates.push({
               workflowTemplateName: file.name,
               workflowTemplateID: file.name,
               description: "template uploading has been executed",
             })
         });
      });
      res.status(200).send("OK")
  } else {
      res.status(500).send({errorString: "unexpected error"}).end()
  }
})

app.get("/api/v0.2/workflow", function(req, res) {
    if (authorize(req.headers.authorization, token)) {
        if (workflows.length == 5) {
            // just insert 5 workFlow templates to test internal server error
            res.status(500).end();
        } else {
            res.status(200).json(workflows);
        }
    } else {
        res.status(500).send("Invalid token");
    }
});

app.get("/api/v0.2/workflow/:workflowId", function(req, res) {
    if (authorize(req.headers.authorization, token)) {
        let result = workflowDetail.find(function(element) {
                  return element.workflowID == req.params.workflowId;

        });
        if (result == null) {
                  res.status(404).end();

        } else {
                  res.status(200).json(result);

        }

    } else {
            res.status(500).send("Invalid token");

    }

});

// create work (POST)
app.post("/api/v0.2/workflow", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let project
    let template
    if(
      (project = projects.find((p) => p.ProjectID === req.body.projectID))
      && (template = workflowTemplatesDetail.find((wftDet) => wftDet.workflowTemplateID === req.body.workflowTemplateID))
    ) {
        console.log(
        "Submitted workflow\n===========================",
        req,
        "\n==========================="
        )

      let newID = `${req.body.workflowName}-${generateHash256()}`
      while(workflows.find((wf) => wf.workflowID === newID)){
        newID = `${req.body.workflowName}-${generateHash256()}`
      }
      workflows.push({
        workflowID: newID,
        workflowTemplateId: req.body.workflowTemplateId,
        projectId: req.body.projectId,
        workflowName: req.body.workflowName,
        creationTime: new Date().toLocaleString()
      })
      workflowDetail.push(
        {
          workflowID: newID,
          projectID: req.body.projectId,
          projectName: project.ProjectName,
          projectShortName: project.projectShortName,
          workflowName: req.body.workflowName,
          ..._.omit(template, ['description'])

        }
      )
      //console.log(
      //  "Submitted workflow\n===========================",
      //  workflows,
      //  "\n==========================="
      //)

      res.status(201).json({ID: newID}).end()
    } else {
      res.status(400).json({errorString: 'Bad request'})
    }
  } else {
    res.status(500).send("Invalid token")
  }
});

app.delete("/api/v0.2/workflow/:workflowId", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    const length = workflows.length

    setTimeout(() => {
      workflows = workflows.filter(
        (workflows) => workflows.workflowId !== req.params.workflowId
      )
      if (workflows === workflows.length) {
        res.sendStatus(406)
      } else {
        res.sendStatus(200)
      }
    }, 5000)
  } else {
    res.status(500).send("Invalid token")
  }
})

// have removed ?reqSize query here, will needed added in
//app.get("/api/v0.2/workflowExecution", function(req, res) {
app.get("/api/v0.2/workflow/:workflowId/execution", function(req, res) {
    if (authorize(req.headers.authorization, token)) {
    console.log(
      "Getting workflowExecutions\n===========================",
      req.params.workflowId,
      "\n==========================="
    )
        if (workflowExecutions.length == 5) {
            // just insert 5 workFlow templates to test internal server error
            res.status(500).end();
        } else {
            res.status(200).json(workflowExecutions);
        }
    } else {
        res.status(500).send("Invalid token");
    }
});
// create workflowExecution (POST)
app.post("/api/v0.2/workflow/:workflowId/execution", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    //workflows.push({
    //  workflowTemplateId: req.body.workflowTemplateId,
    //  workflowName: req.body.workflowName,
    //}//)

      const util = require('util')

//      console.log(util.inspect(req.body, {showHidden: false, depth: null}))

    console.log(
      "Created workflowExecution\n===========================",
      util.inspect(req.body, {showHidden: false, depth: null}),
      req.params.workflowId,
      "\n==========================="
    )

    res.status(201).end()
  } else {
    res.status(500).send("Invalid token")
  }
});

// create workflowExecution (POST)
app.post("/api/v0.2/workflow/:workflowId/executions", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    //workflows.push({
    //  workflowTemplateId: req.body.workflowTemplateId,
    //  workflowName: req.body.workflowName,
    //}//)

      const util = require('util')

//      console.log(util.inspect(req.body, {showHidden: false, depth: null}))
    console.log(`executionsCount`, req.body.length)
    for (let i = 0; i < req.body.length; i++) {
      const exec = req.body[i];
      
      console.log(
        "Created workflowExecution\n===========================",
        util.inspect(exec, {showHidden: false, depth: null}),
        req.params.workflowId,
        "\n==========================="
      )
    }
    res.status(201).end()
  } else {
    res.status(500).send("Invalid token")
  }
});

app.post("/api/v0.2/workflow/:workflowId/execution/run", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    console.log(
      "Running workflowExecution\n===========================",
      req.params.workflowId,
      "\n==========================="
    )
    res.status(200).json(workflows)
  } else {
    res.status(500).send("Invalid token")
  }
});

// Get workflowExecutionDetail
app.get("/api/v0.2/workflow/:workflowId/execution/:workflowExecutionId", function(req, res) {
    console.log(
      "Getting workflowExecution Detail\n===========================",
      req.params.workflowId,
      req.params.workflowExecutionId,
      "\n==========================="
    )
    if (authorize(req.headers.authorization, token)) {
        let result = workflowExecutionDetail.find(function(element) {
                  return element.workflowExecutionID == req.params.workflowExecutionId;

        });
        console.log(
            "Returned workflowExecution\n",
            result,
            "=====\n"
        )
        if (result == null) {
                  res.status(404).end();

        } else {
                  res.status(200).json(result);

        }

    } else {
            res.status(500).send("Invalid token");

    }

});

// Get workflowExecution Logs
app.get("/api/v0.2/workflow/:workflowId/execution/:workflowExecutionId/Logs", function(req, res) {
    console.log(
      "Getting workflowExecution Logs\n===========================",
      workflowExecutionLogs,
      "\n==========================="
    )
    if (authorize(req.headers.authorization, token)) {
        res.status(200).json(workflowExecutionLogs);
    } else {
        res.status(500).send("Invalid token");
    }

});

// Get workflowExecution Status
app.get("/api/v0.2/workflow/:workflowId/execution/:workflowExecutionId/status", function(req, res) {
    console.log(
      "Getting workflowExecution Statuss===========================\n",
      workflowExecutionStepStatus,
      "\n==========================="
    )
    if (authorize(req.headers.authorization, token)) {
        res.status(200).json(workflowExecutionStepStatus);
    } else {
        res.status(500).send("Invalid token");
    }

});

app.delete("/api/v0.2/workflow/:workflowId/execution/:workflowExecutionId", (req, res) => {
    if (authorize(req.headers.authorization, token)) {
        console.log(
            "Deleting workflow execution\n",
            req.params.workflowId,
            req.params.workflowExecutionId,
            "\n===="
        )
        res.send(202).end();
    } else {
        res.status(500).send("Invalid token");
    }
});

// authz add role

app.post("/api/v0.2/authz/:userID/add/:role", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
      res.status(200).end()
  } else {
    res.status(500).send("Invalid token");
  }
})

// FIXME
/* PROJECT'S USERS */
app.get("/api/v0.1/projectusers", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
      res.status(200).json(projectUsers);
  } else {
    res.status(500).send("Invalid token");
  }
})

// GET all users

// simulate expired token on projects list (by `yarn start SIMULATE_EXPIRED_TOKEN=true`)
let simulateExpiredToken = process.env.SIMULATE_EXPIRED_TOKEN ? true : false

// app.get("/api/v0.2/user", (req, res) => {
//   if (authorize(req.headers.authorization, token)) {
//     console.log("\n\n\n\n", process.env.SIMULATE_EXPIRED_TOKEN)
//     if (simulateExpiredToken) {
//       // simulates error with message "token no longer valid"
//       res.status(500).send({ message: "token no longer valid"})
//     } else {
//       let qs = req.query.email
//       qs = "@"

//       console.log(users)
//       res.status(200).json(users);
//     }
//   } else {
//     res.status(500).send("Invalid token");
//   }
// })

// POST project's user
app.post("/api/v0.2/projectusers", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    projectUsers.push({
      AssociatedLEXISProjectID: req.body.AssociatedLEXISProjectID,
      AddedToLEXISProjectDateTime: req.body.AddedToLEXISProjectDateTime,
      Id: req.body.Id,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      EmailAddress: req.body.EmailAddress,
      OrganizationID: req.body.OrganizationID
    })
    res.status(201).end()
  } else {
    res.status(500).send("Invalid token")
  }
})

// DELETE project's user
app.delete("/api/v0.2/projectusers/:projectId/:userId", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    let len = projectUsers.length
    projectUsers = projectUsers.filter(el => ((el.PGPKeyID !== req.params.projectId) || (el.Id !== req.params.userId)))


    if (len === projectUsers.length) {
      res.sendStatus(406).end();
    } else {
      res.sendStatus(200).end();
    }
  } else {
    res.status(500).send("Invalid token");
  }
})

// GET ALL (???) info about HPC resources from userOrg
app.get("/api/v0.2/hpc/resource", (req, res) => {
  if (authorize(req.headers.authorization, token)) {
    if (projectUsers.length == 11) {
      res.status(500).end();
    } else {
      res.status(200).json(listOfHPCresources);
    }
  } else {
    res.status(500).send("Invalid token");
  }
})

// heappe
app.get('/api/v0.2/heappe/ClusterInformation/ListAvailableClusters', (req, res) => {
  res.json(availableClusters)
})
app.post('/api/v0.2/heappe/ClusterInformation/GetCommandTemplateParametersName', (req, res) => {
  // res.json(
  // [
  //   "grid_size_x",
  //   "grid_size_y",
  //   "input_filename"
  // ]
  // )
  res.status(500).end()
})
