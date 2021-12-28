/* helper functions */
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

//const organizationID = uuidv4()
const organizationID = '8dd5da7f-c274-4b63-812a-3c4026d0138d'


const prjManagerPerms = {
  org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  iam_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  iam_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  iam_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
  prj_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}, {ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_earthquake",PRJ_UUID:"LEXIS_ID_3"}],
  prj_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}]
}

const datManagerPerms = {
  dat_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
  dat_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
  dat_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
  dat_publish:[/*{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},*/{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
  org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
  prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
}

let userPermissions
switch (process.env.USER_ROLE) {
  case 'org_mgr':
    userPermissions = {
      dat_list: [
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_weather",
          PRJ_UUID: "LEXIS_ID_2",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_pilot",
          PRJ_UUID: "LEXIS_ID_1",
        },
      ],
      dat_read: [
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_weather",
          PRJ_UUID: "LEXIS_ID_2",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_pilot",
          PRJ_UUID: "LEXIS_ID_1",
        },
      ],
      iam_list: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      iam_read: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      iam_write: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      org_list: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      org_read: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      org_write: [{ ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d" }],
      prj_list: [
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_weather",
          PRJ_UUID: "LEXIS_ID_2",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_pilot",
          PRJ_UUID: "LEXIS_ID_1",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_earthquake",
          PRJ_UUID: "LEXIS_ID_3",
        },
      ],
      prj_read: [
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_weather",
          PRJ_UUID: "LEXIS_ID_2",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_pilot",
          PRJ_UUID: "LEXIS_ID_1",
        },
      ],
      prj_write: [
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_weather",
          PRJ_UUID: "LEXIS_ID_2",
        },
        {
          ORG_UUID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
          PRJ: "lexis_pilot",
          PRJ_UUID: "LEXIS_ID_1",
        },
      ],
    };
    break
  case 'prj_mgr':
    userPermissions = {
      org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      iam_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      iam_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      iam_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      prj_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}, {ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_earthquake",PRJ_UUID:"LEXIS_ID_3"}],
      prj_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}]
    }
    break
  case 'dat_mgr':
    userPermissions = {
      dat_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_publish:[/*{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},*/{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
    }
    break
  case 'wfl_mgr':
    userPermissions = {
      dat_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_publish:[/*{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},*/{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      prj_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}, {ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_earthquake",PRJ_UUID:"LEXIS_ID_3"}],
      prj_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
    }
    break
  case 'end_usr':
    userPermissions = {
      dat_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
    }
    break
  default:
    userPermissions = {
      dat_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      dat_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      iam_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      iam_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      iam_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      org_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d"}],
      prj_list:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      prj_read:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}],
      prj_write:[{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_weather",PRJ_UUID:"LEXIS_ID_2"},{ORG_UUID:"8dd5da7f-c274-4b63-812a-3c4026d0138d",PRJ:"lexis_pilot",PRJ_UUID:"LEXIS_ID_1"}]

    }
    break
}


/* mock data */
var list = [
  {
    ID: "8dd5ia7f-c274-4b63-812a-3c4026d0138d",
    FormalName: "Lexis alternative org.",
    CreationDate: Date.now(),
    Website: "www.lexis.2nd.tech",
    OrganizationEmailAddress: "orgmgr@lexis.2nd.tech",
  },
  {
    ID: "8dd5za7f-c274-4b63-812a-3c4026d0138d",
    FormalName: "Lexis different org.",
    CreationDate: Date.now(),
    Website: "www.lexis.3rd.tech",
    OrganizationEmailAddress: "orgmgr@lexis.3rd.tech",
  }
]
if(process.env.ASSIGNED_TO_ORG){
  list.push({
    ID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
    FormalName: "Lexis company",
    CreationDate: Date.now(),
    Website: "www.lexis.tech",
    OrganizationEmailAddress: "email@email.tech",
  })
}

// var users = [
//   {
//     ID: "8dd5da7f-c274-4b63-812a-3c4026d0138d",
//     FirstName: "Abc",
//     LastName: "Cde",
//     EmailAddress: "abc@cde.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "f0cdf6fe-7318-4e23-88a3-22b5fd56e421",
//     FirstName: "Cathryn",
//     LastName: "Lewis",
//     EmailAddress: "cathryn.lewis@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "42be9c83-055e-45be-96fd-9bade18bb95e",
//     FirstName: "Rosella",
//     LastName: "Booth",
//     EmailAddress: "rosella.booth@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "d6ebc380-51f2-463c-b6b4-6540c20a28ce",
//     FirstName: "Renee",
//     LastName: "Collier",
//     EmailAddress: "renee.collier@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "98500862-8c27-4050-a817-52fcfa35892c",
//     FirstName: "Noemi",
//     LastName: "Knox",
//     EmailAddress: "noemi.knox@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "caed08f8-b985-4220-9ccd-1e4b37f62cec",
//     FirstName: "Gomez",
//     LastName: "Battle",
//     EmailAddress: "gomez.battle@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "b2bc33c6-5af6-411e-8621-809de31dbc13",
//     FirstName: "Ollie",
//     LastName: "Hampton",
//     EmailAddress: "ollie.hampton@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "10b79f98-f713-49ac-807b-7887d0d0bfe0",
//     FirstName: "Mccray",
//     LastName: "Frye",
//     EmailAddress: "mccray.frye@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "1235a31f-8a7a-4d71-9fd9-6d88df9b7967",
//     FirstName: "Bates",
//     LastName: "Bruce",
//     EmailAddress: "bates.bruce@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "b3398f54-e337-4e39-8528-ff106b81f976",
//     FirstName: "Young",
//     LastName: "Owen",
//     EmailAddress: "young.owen@lexis.com",
//     OrganizationID: organizationID,
//     Permissions: datManagerPerms,
//     Projects: ['LEXIS_ID_5','LEXIS_ID_1'],
//   },
//   {
//     ID: "7a1f56c8-0408-4fc4-be0c-a39ac0de095d",
//     FirstName: "Ramos",
//     LastName: "Herring",
//     EmailAddress: "ramos.herring@lexis.com",
//     OrganizationID: organizationID,
//     Projects: ['LEXIS_ID_5'],
//     Permissions:{},
//   },
//   {
//     ID: "424be11d-49dd-4645-b886-9fc7d2951043",
//     FirstName: "Kris",
//     LastName: "Albert",
//     EmailAddress: "kris.albert@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "d995d324-8800-4f06-932b-b4b8eac74d78",
//     FirstName: "Juanita",
//     LastName: "Petersen",
//     EmailAddress: "juanita.petersen@lexis.com",
//     OrganizationID: organizationID,
//     Projects: ['LEXIS_ID_1'],
//     Permissions:{},
//   },
//   {
//     ID: "adfc69b3-e586-4df9-ae8a-d4a0fa2c8688",
//     FirstName: "Hilda",
//     LastName: "Sheppard",
//     EmailAddress: "hilda.sheppard@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
//   {
//     ID: "b0e08a33-70e6-4e99-a0ad-c683570de8dc",
//     FirstName: "Estes",
//     LastName: "Wolf",
//     EmailAddress: "estes.wolf@lexis.com",
//     OrganizationID: organizationID,
//     Permissions:{},
//     Projects: [],
//   },
//   {
//     ID: "b79dcd26-d549-4b93-9f60-73013a2f523a",
//     FirstName: "Courtney",
//     LastName: "Galloway",
//     EmailAddress: "courtney.galloway@lexis.com",
//     OrganizationID: organizationID,
//     Permissions: prjManagerPerms,
//     Projects: ['LEXIS_ID_1'],
//   },
//   {
//     ID: "04d66e3c-008b-41a5-864e-105c1556c8d4",
//     FirstName: "Waters",
//     LastName: "Price",
//     EmailAddress: "waters.price@lexis.com",
//     OrganizationID: organizationID,
//     Projects: [],
//     Permissions:{},
//   },
// ]

var hpcresources = [
  {
    AssociatedHPCProject: "some project X",
    AssociatedLEXISProject: "LEXIS_ID_1",
    HPCProvider: "IT4I",
    HPCResourceID: "8f008ba2-2730-4a89-b6cd-2d535e9a9605",
    ResourceType: "OpenStack",
    TermsConsent: true,
  },
]

var hpcResourceRequestsSentBackFromApproval = [
  {
    ApprovalStatus: "PENDING",
    Budget: 500,
    CoreHoursExpected: 500,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 10,
    LEXISProjectID: "6ac2ea2a-3efd-28da-6ba4-8643d974dca2",
    LEXISProjectName: "test1",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "ClusterName1",
        QueueId: 1,
        QueueName: "QueueName1",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 50000,
    CoreHoursExpected: 8000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 11,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 50000,
    CoreHoursExpected: 10000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 12,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 50000,
    CoreHoursExpected: 10000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 13,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 2,
        QueueName: "qprod",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "REJECTED",
    Budget: 50000,
    CoreHoursExpected: 500000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 14,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    ApprovalObjections: "blah blah blah, there're some objections...",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 2,
        QueueName: "qprod",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 40000,
    CoreHoursExpected: 10000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 15,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 50000,
    CoreHoursExpected: 10000,
    DateEnd: "2020-06-26T11:28:08.767",
    DateStart: "2020-06-26T11:28:08.767",
    HPCResourceRequestID: 16,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    PrimaryInvestigator: "Karel@jozef.cz",
    ProjectContactEmail: "Karel@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
      {
        ClusterId: 2,
        ClusterName: "Salomon",
        QueueId: 4,
        QueueName: "qprod",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 1,
    CoreHoursExpected: 100,
    DateEnd: "2020-01-26T11:28:08.767",
    DateStart: "2020-01-26T11:28:08.767",
    HPCResourceRequestID: 1,
    LEXISProjectID: "LEXIS_ID_2",
    LEXISProjectName: "TWO 2 2",
    PrimaryInvestigator: "1@jozef.cz",
    ProjectContactEmail: "1@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 1,
        QueueName: "qexp",
      },
    ],
    TermsConsent: true,
  },
  {
    ApprovalStatus: "APPROVED",
    Budget: 2,
    CoreHoursExpected: 200,
    DateEnd: "2020-02-26T11:28:08.767",
    DateStart: "2020-02-26T11:28:08.767",
    HPCResourceRequestID: 2,
    LEXISProjectID: "LEXIS_ID_2",
    LEXISProjectName: "TWO 2 2",
    PrimaryInvestigator: "2@jozef.cz",
    ProjectContactEmail: "2@jozef.cz",
    Resources: [
      {
        ClusterId: 1,
        ClusterName: "Anselm",
        QueueId: 2,
        QueueName: "qprod",
      },
    ],
    TermsConsent: true,
  },
]

var hpcApprovedResourceRequestsSentBackFromApproval = [
  {
    ApprovalObjections: null,
    ApprovalStatus: "PENDING",
    HPCProjectID: uuidv4(),
    HPCResourceID: 0,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectContactEmail: "abc1@cde.com",
    TermsConsent: true,
    HPCProvider: "IT4I",
  },
  {
    ApprovalObjections: null,
    ApprovalStatus: "APPROVED",
    HPCProjectID: uuidv4(),
    HPCResourceID: 1,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectContactEmail: "abc1@cde.com",
    TermsConsent: true,
    HPCProvider: "IT4I",
  },
  {
    ApprovalObjections:
      "Some objections why this Approved Resources Request has been rejected.",
    ApprovalStatus: "REJECTED",
    HPCProjectID: uuidv4(),
    HPCResourceID: 2,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectContactEmail: "abc1@cde.com",
    TermsConsent: true,
    HPCProvider: "IT4I",
  },
  {
    ApprovalObjections: null,
    ApprovalStatus: "PENDING",
    HPCProjectID: uuidv4(),
    HPCResourceID: 3,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectContactEmail: "abc1@cde.com",
    TermsConsent: true,
    HPCProvider: "LRZ",
  },
  {
    ApprovalObjections:
      "Another objections why this Approved Resources Request has been rejected.",
    ApprovalStatus: "REJECTED",
    HPCProjectID: uuidv4(),
    HPCResourceID: 4,
    LEXISProjectID: "LEXIS_ID_1",
    LEXISProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectContactEmail: "abc1@cde.com",
    TermsConsent: true,
    HPCProvider: "LRZ",
  },
  {
    ApprovalObjections: null,
    ApprovalStatus: "PENDING",
    HPCProjectID: uuidv4(),
    HPCResourceID: 5,
    LEXISProjectID: "LEXIS_ID_2",
    LEXISProjectName: "TWO 2 2",
    ProjectContactEmail: "abc2@cde.com",
    TermsConsent: true,
    HPCProvider: "LRZ",
  },
  {
    ApprovalObjections: null,
    ApprovalStatus: "PENDING",
    HPCProjectID: uuidv4(),
    HPCResourceID: 6,
    LEXISProjectID: "LEXIS_ID_2",
    LEXISProjectName: "TWO 2 2",
    ProjectContactEmail: "abc2@cde.com",
    TermsConsent: true,
    HPCProvider: "IT4I",
  },
  {
    ApprovalObjections: null,
    ApprovalStatus: "APPROVED",
    HPCProjectID: uuidv4(),
    HPCResourceID: 7,
    LEXISProjectID: "LEXIS_ID_4",
    LEXISProjectName: "LEXIS project 4",
    ProjectContactEmail: "project4@lexis.com",
    TermsConsent: true,
    HPCProvider: "LRZ",
  },
]

var projects = [
  {
    ProjectID: "LEXIS_ID_1",
    ProjectName: "LEXIS Earthquake and tsunami pilot project",
    ProjectDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quisnostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ProjectCreationTime: Date.UTC(2019, 12, 31, 4, 7, 39),
    ProjectCreatedBy: "80257735-d6d3-4caa-8628-8fc6f861a187",
    LinkedOrganization: organizationID,
    ProjectStatus: "PENDING",
    ProjectContactPerson: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    ProjectStartDate: Date.UTC(2020, 1, 17),
    ProjectTerminationDate: Date.UTC(2021, 12, 31),
    ProjectMaxPrice: 1000,
    NormCoreHours: 30000,
    ProjectDomain: "Natural Sciences",
    ProjectContactEmail:"engineer@engineer.com",
    ProjectShortName: "lexis_pilot",
  },
  {
    ProjectID: "LEXIS_ID_2",
    ProjectName: "TWO 2 2",
    ProjectDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    ProjectCreationTime: Date.UTC(2019, 12, 31, 4, 7, 39),
    ProjectCreatedBy: "80257735-d6d3-4caa-8628-8fc6f861a187",
    LinkedOrganization: uuidv4(),
    ProjectStatus: "PENDING",
    ProjectContactPerson: "f0cdf6fe-7318-4e23-88a3-22b5fd56e421",
    ProjectStartDate: Date.UTC(2020, 4, 1),
    ProjectTerminationDate: Date.UTC(2020, 5, 30),
    ProjectMaxPrice: 2000,
    NormCoreHours: 0,
    ProjectDomain: "Natural Sciences",
    ProjectContactEmail:"engineer@engineer.com",
    ProjectShortName: "lexis_weather",
  },
  {
    ProjectID: "LEXIS_ID_3",
    ProjectName: "LEXIS project 3",
    ProjectDescription:
      "HPCProjects of accounting info of this project is empty, there's no projects associated with this LEXIS project.",
    ProjectCreationTime: Date.UTC(2019, 12, 31, 4, 7, 39),
    ProjectCreatedBy: "b2bc33c6-5df6-411e-8621-809de31dbc13",
    LinkedOrganization: uuidv4(),
    ProjectStatus: "PENDING",
    ProjectContactPerson: "foo@bar.no",
    ProjectStartDate: Date.UTC(2020, 12, 1),
    ProjectTerminationDate: Date.UTC(2020, 12, 31),
    NormCoreHours: 100,
    ProjectMaxPrice: 3000,
    ProjectDomain: "Natural Sciences",
    ProjectContactEmail:"engineer@engineer.com",
    ProjectShortName: "lexis_earthquake",
  },
  {
    ProjectID: "LEXIS_ID_4",
    ProjectName: "LEXIS project 4",
    ProjectDescription:
      "HPCProjects of accounting info of this project is not empty, there're projects associated with this LEXIS project but with zero usage data.",
    ProjectCreationTime: Date.UTC(2019, 12, 31, 4, 7, 39),
    ProjectCreatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    LinkedOrganization: uuidv4(),
    ProjectStatus: "PENDING",
    ProjectContactPerson: "b2bc33c6-5df6-411e-8621-809de31dbc13",
    ProjectStartDate: Date.UTC(2020, 4, 1),
    ProjectTerminationDate: Date.UTC(2020, 5, 30),
    ProjectMaxPrice: 4000,
    NormCoreHours: 10,
    ProjectDomain: "Natural Sciences",
    ProjectContactEmail:"engineer@engineer.com",
    ProjectShortName: "lexis_forecast",
  },
  {
    ProjectID: "LEXIS_ID_5",
    ProjectName: "LEXIS project ANY account info",
    ProjectDescription: "API fails.",
    ProjectCreationTime: Date.UTC(2019, 12, 31, 4, 7, 39),
    ProjectCreatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    LinkedOrganization: uuidv4(),
    ProjectStatus: "PENDING",
    ProjectContactPerson: "b2bc33c6-5df6-411e-8621-809de31dbc13",
    ProjectStartDate: Date.UTC(2020, 4, 1),
    ProjectTerminationDate: Date.UTC(2020, 5, 30),
    ProjectMaxPrice: 4,
    NormCoreHours: 5,
    ProjectDomain: "Natural Sciences",
    ProjectContactEmail:"engineer@engineer.com",
    ProjectShortName: "lexis_loremipsum",
  },
]


var projectUsers = [
  {
    ID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    FirstName: "Abc",
    LastName: "Cde",
    RegistrationDateTime: "2020-06-11T00:25:34.883Z",
    EmailAddress: "abc@cde.com",
    OrganizationID: organizationID,
    PGPKeyID: "LEXIS_1", // === USED AS AsssociatedProjectID
    Permissions: {},
    Projects: ['LEXIS_ID_5','LEXIS_ID_1', 'LEXIS_ID_2', 'LEXIS_ID_3'],
    Username: "abccd"
  },
  {
    ID: "f0cdf6fe-7318-4e23-88a3-22b5fd56e421",
    FirstName: "Cathryn",
    LastName: "Lewis",
    RegistrationDateTime: "2020-05-11T00:25:34.883Z",
    EmailAddress: "Cathryn@Lewis.com",
    OrganizationID: organizationID,
    PGPKeyID: "LEXIS_2", // === USED AS AsssociatedProjectID
    Projects: ['LEXIS_ID_3', 'LEXIS_ID_1', 'LEXIS_ID_2'],
    Username: "cathrynle",
    Permissions: prjManagerPerms,
  },
  {
    ID: "42be9c83-055e-45be-96fd-9bade18bb95e",
    FirstName: "Rosella",
    LastName: "Booth",
    RegistrationDateTime: "2020-11-11T00:25:34.883Z",
    EmailAddress: "user@example.com",
    OrganizationID: organizationID,
    Permissions: {},
    PGPKeyID: "LEXIS_4", // === USED AS AsssociatedProjectID
    Username: "rosellabo"
  },
  {
    ID: "b2bc33c6-5df6-411e-8621-809de31dbc13",
    FirstName: "chemical",
    LastName: "engineer",
    RegistrationDateTime: "2021-06-11T00:48:29.637Z",
    EmailAddress: "engineer@eengineer.vsb",
    OrganizationID: organizationID,
    AllowedOrganizations: [
      "8dd5za7f-c274-4b63-812a-3c4026d0138d",
      "8dd5ia7f-c274-4b63-812a-3c4026d0138d"
    ],
    PGPKeyID: "LEXIS_3", // === USED AS AsssociatedProjectID
    Projects: ['LEXIS_ID_3'],
    Username: "chemicalen",
    Permissions: datManagerPerms,
  },
];

// users
let users = projectUsers
console.log(users)

// usageManagement - Actions relating to management of Cyclops usage, ie. endpoint to get core spent core hours
var usageManagementProjectsArray = [
  {
    ProjectID: "LEXIS_ID_1",
    ProjectName: "LEXIS Earthquake and tsunami pilot project",
    TimeFrom: "2021-06-02T09:45:43.621Z",
    TimeTo: "2021-12-22T08:37:54.190Z",
    HPCProjects: [
      {
        HPCProjectID: "14115a0e-f76e-5da5-1840-011292c54614",
        AccountingData: [
          {
            cost: 3383.3,
            resource_type: "floatingip",
            resources_amount: 126,
            usage: { active: 11808645, inactive: 280514406 },
          },
          {
            cost: 13884.27,
            resource_type: "blockstorage",
            resources_amount: 11,
            size: 1000,
            usage: { active: 9446004 },
          },
          {
            cost: 12857.87,
            flavor: "xlarge-mem",
            resource_type: "server",
            resources_amount: 66,
            usage: { active: 9559146, inactive: 20709 },
          },
          {
            cost: 4875.48,
            flavor: "large",
            resource_type: "server",
            resources_amount: 5,
            usage: { active: 1985301, inactive: 1800 },
          },
          {
            cost: 6.82,
            flavor: "normal",
            resource_type: "server",
            resources_amount: 4,
            usage: { active: 8121, inactive: 2703 },
          },
          {
            cost: 404.94,
            flavor: "xlarge-cpu-mem",
            resource_type: "server",
            resources_amount: 17,
            usage: { active: 256884, inactive: 10815 },
          },
        ],
      },
    ],
  },
  {
    ProjectID: "LEXIS_ID_2",
    ProjectName: "TWO 2 2",
    TimeFrom: "2021-06-02T09:45:43.621Z",
    TimeTo: "2021-12-22T08:37:54.190Z",
    HPCProjects: [
      {
        HPCProjectID: "d3c47876-7367-8ea5-1fd5-bc7862a703dd",
        AccountingData: [
          {
            cost: 3383.3,
            resource_type: "floatingip",
            resources_amount: 126,
            usage: { active: 11808645, inactive: 280514406 },
          },
          {
            cost: 6.82,
            flavor: "normal",
            resource_type: "server",
            resources_amount: 4,
            usage: { active: 8121, inactive: 2703 },
          },
          {
            cost: 404.94,
            flavor: "xlarge-cpu-mem",
            resource_type: "server",
            resources_amount: 17,
            usage: { active: 256884, inactive: 10815 },
          },
        ],
      },
      {
        HPCProjectID: "0626fb2c-dc1b-49b3-a96d-8d2ec0182138",
        AccountingData: [],
      },
      {
        HPCProjectID: "8001c68f-cdcc-9eaf-496c-408d1ae405ce",
        AccountingData: [
          {
            cost: 13884.27,
            resource_type: "blockstorage",
            resources_amount: 11,
            size: 1000,
            usage: { active: 9446004 },
          },
          {
            cost: 12857.87,
            flavor: "xlarge-mem",
            resource_type: "server",
            resources_amount: 66,
            usage: { active: 9559146, inactive: 20709 },
          },
          {
            cost: 4875.48,
            flavor: "large",
            resource_type: "server",
            resources_amount: 5,
            usage: { active: 1985301, inactive: 1800 },
          },
        ],
      },
    ],
  },
  {
    ProjectID: "LEXIS_ID_3",
    ProjectName: "LEXIS project 3",
    TimeFrom: "2021-06-02T09:45:43.621Z",
    TimeTo: "2021-12-22T08:37:54.190Z",
    HPCProjects: [],
  },
  {
    ProjectID: "LEXIS_ID_4",
    ProjectName: "LEXIS project 4",
    TimeFrom: "2021-06-02T09:45:43.621Z",
    TimeTo: "2021-12-22T08:37:54.190Z",
    HPCProjects: null,
  },
];

// `type` of each resource queue could be: 1 = "CPU", 2 = "GPU", 3 = "SMP"
var dynamicResourcesSelection = [
  {
    Id: 1,
    Name: "Anselm",
    HostName: "anselm.it4i.cz",
    PerformanceCoefficient: 0.7,
    QueueList: [
      {
        Id: 1,
        Name: "qexp",
        Description: "Express queue",
        Type: "CPU",
        MaxWallTime: 3600,
        NumberOfNodes: 8,
        CoresPerNode: 16,
      },
      {
        Id: 2,
        Name: "qprod",
        Description: "Production queue",
        Type: "CPU",
        MaxWallTime: 172800,
        NumberOfNodes: 18,
        CoresPerNode: 16,
      },
    ],
  },
  {
    Id: 2,
    Name: "Salomon",
    HostName: "salomon.it4i.cz",
    PerformanceCoefficient: 1,
    QueueList: [
      {
        Id: 3,
        Name: "qexp",
        Description: "Express queue",
        Type: "CPU",
        MaxWallTime: 3600,
        NumberOfNodes: 8,
        CoresPerNode: 24,
      },
      {
        Id: 4,
        Name: "qprod",
        Description: "Production queue",
        Type: "CPU",
        MaxWallTime: 172800,
        NumberOfNodes: 68,
        CoresPerNode: 24,
      },
    ],
  },
]

var dataset_staging_info = [
  "lrz_cloud",
  "superMUC",
  "lrz_iRODS",
  "linux_cluster",
  "it4i_iRODS",
  "barbora_home",
  "salomon_home",
  "salomon_lustre",
  "lrz_staging_area",
  "barbora_lustre",
  "SURF_iRODS",
]
var dataset_staging_stage = {
  request_id: "447c76cd-dadd-4151-b5e8-b61b23b3cc8d",
}
var dataset_staging_stage_delete = {
  request_id: "547276cd-d88d-4991-bce9-161b23b3cc86",
}
var dataset_multipart = {
  request_id: "bd0a5d9b-7448-4d87-b468-a83270911506",
}
var dataset_staging_datasize = {
  request_id: "61059cc9-e1d8-450a-bba1-0d862ef83a29",
}

var dataset_staging_datasize_result = {
  status: "Done",
  size: "45645352354",
}

var dataset_multipart_result = {
  status: "Multipart zip created!",
  target_paths: [
    "DDIStaging/multipart/finished/2ba44a6b-4da4-4897-a18d-ec0861260d9f/dataset.zip",
  ],
}
let dataset_files_rand_int = 0
var dataset_files = [
  {
    contents: [
      {
        contents: [
          {
            contents: [
              {
                contents: null,
                create_time: "2020-07-01T09:46:40",
                name: "risico_202006290000.nc",
                size: 52832998,
                type: "file",
              },
            ],
            name: "risico",
            type: "directory",
          }
        ],
        name: "my folder",
        type: "directory",
      }
    ],
    name: "c2d2eb98-bb7f-11ea-8c4e-0050568fc9b5",
    type: "directory",
  },
  {
  contents: [
    {
      contents: [
        {
          contents: [
            {
              contents: null,
              create_time: "2020-07-01T09:46:40",
              name: "risico_202006290000.nc",
              size: 52832998,
              type: "file",
            },
          ],
          name: "risico",
          type: "directory",
        },
        {
          contents: [
            {
              contents: null,
              create_time: "2020-07-01T09:46:41",
              name: "auxhist23_d01_2020-06-29_00:00:00",
              size: 20442708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:41",
              name: "auxhist23_d01_2020-06-29_01:00:00",
              size: 20442708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:42",
              name: "auxhist23_d02_2020-06-29_00:00:00",
              size: 116684708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:47",
              name: "auxhist23_d02_2020-06-29_01:00:00",
              size: 116684708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:44",
              name: "auxhist23_d03_2020-06-29_00:00:00",
              size: 100403708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:45",
              name: "auxhist23_d03_2020-06-29_01:00:00",
              size: 100403708,
              type: "file",
            },
            {
              contents: null,
              create_time: "2021-07-01T11:46:45",
              name: "script.py",
              size: 180000,
              type: "file",
            },
            {
              contents: null,
              create_time: "2020-07-01T09:46:45",
              name: "image.png",
              size: 119155,
              type: "file",
            },
          ],
          name: "wrf",
          type: "directory",
        },
      ],
      name: "2020-07-01-08:22:18",
      type: "directory",
    },
  ],
  name: "c2d2eb98-bb7f-11ea-8c4e-0050568fc9b5",
  type: "directory",
}]
const getDatasetFiles = ()=> dataset_files[(dataset_files_rand_int+=1) % dataset_files.length]

var dataset_stored = "edcca382-b1a4-11ea-8c4e-0050568fc9b5"
var dataset_stage_result_key = "447c76cd-dadd-4151-b5e8-b61b23b3cc8d"
var dataset_deleted_stored = "83202785-abcd-2934-238d-cab234082fa3"
var dataset_staging_stage_result = {
  "447c76cd-dadd-4151-b5e8-b61b23b3cc8d": {
    target_path:
      "/LRZLexisZone/project/19de37bda794a92aa6e514994bf0f930/9e02a940-0173-11eb-b3be-0050568fc9b5",
    status: "Transfer completed",
  },
}
var dataset_staging_stage_delete_result = {
  "83202785-abcd-2934-238d-cab234082fa3": {
    status: "Data deleted",
  },
}

var dataset_sshfsexport = [
  {
    user: "qlecvxbndl",
    sshfs: "qlecvxbndl@lexis-test.srv.lrz.de:",
  },
]

var dataset_userprojects = ["/projects/LEXIS_ID_1", "/projects/LEXIS_ID_2"]

var datasetsMetadataQueryResponse = [
  {
    location: {
      access: "public",
      internalID: "edcca382-b1a4-11ea-8c4e-0050568fc9b5",
      project: "lexis_pilot",
      zone: "IT4ILexisZone", // source_system
      source_path: "/IT4ILexisZone/project/projedcca382-b1a4-11ea-8c4e-0050568fc9b5"
    },
    metadata: {
      AlternateIdentifier: [
        "doiX://lexis-datasets/wp5/dataset1",
        "doiY://lexis-datasets/wp5/dataset1",
      ],
      CustomMetadataSchema: [
        {
          _id: "6064f21d1c45e677d25a0146",
          index: 0,
          guid: "568c17e6-7485-483e-be88-818e2d743e44",
          isActive: true,
          balance: "$3,749.95",
          picture: "http://placehold.it/32x32",
          about:
            "Dolore officia cupidatat quis do occaecat esse ad enim ex nulla duis irure. Qui velit incididunt eiusmod aute sint excepteur dolore dolor ad occaecat est. Qui aliquip Lorem laborum sunt.\r\n",
          registered: "2015-07-10T06:16:28 -02:00",
          latitude: 89.03649,
          longitude: -35.423284,
          tags: [
            "Lorem",
            "Lorem",
            "velit",
            "dolore",
            "magna",
            "Lorem",
            "consectetur",
          ],
          friends: [
            {
              id: 0,
              name: "Beatrice Mayer",
            },
            {
              id: 1,
              name: "Rivers Mcgowan",
            },
            {
              id: 2,
              name: "Sosa Mckinney",
            },
          ],
          greeting: "Hello, Cotton Solis! You have 3 unread messages.",
          favoriteFruit: "banana",
        },
      ],
      contributor: ["RISICO workflow", "ISICO workflow"],
      creator: ["RISICO workflow"],
      owner: ["Stable Ground", "Ground"],
      publisher: ["RISICO workflow", "OCISIR wrkflow"],
      identifier: "doi://lexis-datasets/wp5/dataset1",
      relatedIdentifier: ["x", "y", "z"],
      resourceType: "Workflow result",
      resourceTypeGeneral: "Audiovisual",
      rights: [
        "Open Data Commons Open Database License",
        "Creative Commons Public Domain Dedication",
      ],
      rightsIdentifier: ["ODbL", "CC-0"],
      rightsURI: [
        "https://opendatacommons.org/licenses/odbl/1-0/",
        "https://creativecommons.org/publicdomain/zero/1.0/",
      ],
      title: "wp5/dataset1",
      publicationYear: "2011",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "True",
      PID: "1001/a5f5c19c-e778-11ea-abfe-0050568f81d2",
    },
    size: 1878865464,
    flags: {
      compression: 'no',
      encryption: 'no'
    }
  },
  {
    location: {
      access: "project",
      internalID: "a5b8ddbe-6054-4cb7-98ff-e678b6eba7f4",
      project: "lexis_weather",
      zone: "IT4ILexisZone",
      source_path: "/IT4ILexisZone/project/proja5b8ddbe-6054-4cb7-98ff-e678b6eba7f4"
    },
    metadata: {
      AlternateIdentifier: ["doi://xyz", "doi://klm"],
      CustomMetadataSchema: [
        {
          _id: "6064f21d1c45e677d25a0146",
          index: 0,
          guid: "568c17e6-7485-483e-be88-818e2d743e44",
          isActive: true,
          balance: "$3,749.95",
          picture: "http://placehold.it/32x32",
          about:
            "Dolore officia cupidatat quis do occaecat esse ad enim ex nulla duis irure. Qui velit incididunt eiusmod aute sint excepteur dolore dolor ad occaecat est. Qui aliquip Lorem laborum sunt.\r\n",
          registered: "2015-07-10T06:16:28 -02:00",
          latitude: 89.03649,
          longitude: -35.423284,
          tags: [
            "Lorem",
            "Lorem",
            "velit",
            "dolore",
            "magna",
            "Lorem",
            "consectetur",
          ],
          friends: [
            {
              id: 0,
              name: "Beatrice Mayer",
            },
            {
              id: 1,
              name: "Rivers Mcgowan",
            },
            {
              id: 2,
              name: "Sosa Mckinney",
            },
          ],
          greeting: "Hello, Cotton Solis! You have 3 unread messages.",
          favoriteFruit: "banana",
        },
      ],
      contributor: ["AISICO workflow"],
      creator: ["RISICO workflow"],
      owner: ["Stable Ground", "xyz"],
      publisher: ["RISICO workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset2",
      relatedIdentifier: ["doi://a", "doi://aa"],
      resourceType: "Workflow result",
      resourceTypeGeneral: "Audiovisual",
      rights: ["a"],
      rightsIdentifier: ["ODbL", "CC-0"],
      rightsURI: ["https://opendatacommons.org/licenses/pddl/1-0/"],
      title: "wp5/dataset2",
      publicationYear: "2012",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
    //   PID: "1002/92b7162d-2f4d-4174-b9c8-711ff6b03bbb",
    },
     flags: {
      compression: 'no',
      encryption: 'no'
    },
    size: 1234567890000
  },
  {
    location: {
      access: "user",
      internalID: "5ce23b68-b958-4367-a24b-a10241808a68",
      project: "lexis_pilot",
      zone: "IT4ILexisZone",
      source_path: "/IT4ILexisZone/project/proj0e9a28d97fcc42b597d4ac9a6962da9d/5ce23b68-b958-4367-a24b-a10241808a68"
    },
    metadata: {
      AlternateIdentifier: [2],
      CustomMetadataSchema: [],
      contributor: ["BISICO workflow"],
      creator: ["RISICO workflow", "ICO workflow"],
      owner: ["abc"],
      publisher: ["RISICO workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset3",
      relatedIdentifier: ["1"],
      resourceType: "Workflow result",
      resourceTypeGeneral: "Audiovisual",
      rights: ["b"],
      rightsIdentifier: ["ODbL", "CC-1"],
      rightsURI: ["https://opendatacommons.org/licenses/pddl/1-0/"],
      title: "wp5/dataset3",
      publicationYear: "2013",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      //PID: "1003/dab0cb5c-6463-417c-a7fd-233fc89e27ca",
    },
    flags: {
      compression: 'yes',
      encryption: 'no'
    },
    size: 4164014684467
  },
  {
    location: {
      access: "public",
      internalID: "8eea718a-345b-41f4-8380-1fc160341a43",
      project: "lexis_forecast",
      zone: "IT4ILexisZone",
      source_path: "/IT4ILexisZone/project/proj8eea718a-345b-41f4-8380-1fc160341a43"
    },
    metadata: {
      AlternateIdentifier: [2, 3, 4],
      CustomMetadataSchema: [],
      contributor: ["CISICO4 workflow"],
      creator: ["RISICO4 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO4 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset4",
      relatedIdentifier: ["2"],
      resourceType: "Workflow result4",
      rights: ["b"],
      rightsIdentifier: ["ODbL", "CC-1"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset4",
      publicationYear: "2014",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "True",
      PID: "1004/e5fc4491-e0af-415e-94fa-61e56fdfac0a",
    },
    flags: {
      compression: 'no',
      encryption: 'yes'
    },
    size: 94430
  },
  {
    location: {
      access: "user",
      internalID: "db9326a0-1429-44d5-94b5-039cdcf21021",
      project: "lexis_pilot",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/projdb9326a0-1429-44d5-94b5-039cdcf21021"
    },
    metadata: {
      AlternateIdentifier: ["alt1", "alt2"],
      CustomMetadataSchema: [],
      contributor: ["DISICO5 workflow"],
      creator: ["RISICO5 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO5 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset5",
      relatedIdentifier: ["doi://bbb", "doi://bjsdfhds"],
      resourceType: "Workflow result5",
      rights: ["c"],
      rightsIdentifier: ["CC-2"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset5",
      publicationYear: "2015",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "True",
      PID: "1005/7b6dafd5-6293-4c4a-b591-dd97fa2f6c56",
    },
    size: 944305585070980
  },
  {
    location: {
      access: "public",
      internalID: "76e39e3c-0e40-4cf6-9d90-f1c2862ce435",
      project: "lexis_weather",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/proj76e39e3c-0e40-4cf6-9d90-f1c2862ce435"
    },
    metadata: {
      AlternateIdentifier: ["xxx", "yyy"],
      CustomMetadataSchema: [],
      contributor: ["EISICO6 workflow"],
      creator: ["RISICO6 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO6 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset6",
      relatedIdentifier: ["3"],
      resourceType: "Workflow result6",
      rights: ["d"],
      rightsIdentifier: ["CC-2"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset6",
      publicationYear: "2016",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      PID: "1006/dab0cb5c-6463-417c-a7fd-233fc89e27ca",
    },
    size: 14684
  },
  {
    location: {
      access: "project",
      internalID: "b62bd396-2cd1-48c1-8e25-4543130e60bc",
      project: "lexis_pilot",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/projb62bd396-2cd1-48c1-8e25-4543130e60bc"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset7",
      publicationYear: "2017",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      // PID: "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 6574987
  },
  {
    location: {
      access: "project",
      internalID: "6ba157ad-d339-4b47-a247-5ce701757ee3",
      project: "lexis_pilot",
      zone: "IT4ILexisZone",
      source_path: "/LRZLexisZone/project/proj6ba157ad-d339-4b47-a247-5ce701757ee3"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset8",
      publicationYear: "2018",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      "EUDAT/PARENT": "1007.55/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
      PID: "1007.14/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 12387464687
  },
  {
    location: {
      access: "project",
      internalID: "6ba157ad-d339-4f47-a247-5ce601757ee3",
      project: "lexis_pilot",
      zone: "AnotherLexisZone"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset8",
      publicationYear: "2018",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      "EUDAT/PARENT": "1007.55/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
      PID: "1007.1456/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 12387464687
  },
  {
    location: {
      access: "project",
      internalID: "6ba157ad-d339-4f47-a247-5ce701757ee3",
      project: "lexis_pilot",
      zone: "LRZLexisZone"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset8",
      publicationYear: "2018",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      "EUDAT/REPLICA": "1007.6518/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
      PID: "1007.55/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 12387464687
  },
  {
    location: {
      access: "project",
      internalID: "50b31bfa-98ea-4992-8dc0-e30a5805c81d",
      project: "lexis_pilot",
      zone: "IT4ILexisZone"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset9",
      publicationYear: "2019",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      "EUDAT/PARENT": "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
      PID: "1007.84/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 1232178944
  },
  {
    location: {
      access: "project",
      internalID: "50b31bfa-98ea-4992-8dc0-e30a5805c81d",
      project: "lexis_pilot",
      zone: "LRZLexisZone"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset9",
      publicationYear: "2019",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      "EUDAT/REPLICA": "1007.6518/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
      PID: "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 1232178944
  },
  {
    location: {
      access: "project",
      internalID: "e2f8d108-a4db-467c-bf31-494ec6c9faac",
      project: "lexis_pilot",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/proje2f8d108-a4db-467c-bf31-494ec6c9faac"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset10",
      publicationYear: "2020",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      PID: "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 123217894445747
  },
  {
    location: {
      access: "project",
      internalID: "9942c3b3-f487-4248-b057-4d3f01d57da8",
      project: "lexis_pilot",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/proj9942c3b3-f487-4248-b057-4d3f01d57da8"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset11",
      publicationYear: "2021",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      PID: "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 12314
  },
  {
    location: {
      access: "project",
      internalID: "4ec298d2-ecd1-4780-923c-407dc676b0c0",
      project: "lexis_pilot",
      zone: "LRZLexisZone",
      source_path: "/LRZLexisZone/project/proj4ec298d2-ecd1-4780-923c-407dc676b0c0"
    },
    metadata: {
      AlternateIdentifier: ["zzz"],
      CustomMetadataSchema: [],
      contributor: ["FISICO7 workflow"],
      creator: ["RISICO7 workflow"],
      owner: ["Stable Ground"],
      publisher: ["RISICO7 workflow"],
      identifier: "doi://lexis-datasets/wp5/dataset7",
      relatedIdentifier: ["4"],
      resourceType: "Workflow result7",
      rights: ["d"],
      rightsIdentifier: ["CC-3", "ODB"],
      rightsURI: ["https://opendatacommons.org/licenses/by/1-0/"],
      title: "wp5/dataset12",
      publicationYear: "2021",
    },
    eudat: {
      "EUDAT/FIXED_CONTENT": "False",
      PID: "1007/960a7a4a-6cd3-413f-b0df-64367b44f9b8",
    },
    size: 7000000
  },
]

var dataset_tusuploadloc = "9ddc82f1-3c11-4e95-9bee-baa8dcc93759"

var workflowTemplates = [
  {
    "description": "LEXIS Generic Template",
    "inputFiles": null,
    "inputParameters": null,
    "nodeTemplates": null,
    "workflowTemplateID": "org.lexis.common.LEXISTemplate:0.1.0-SNAPSHOT",
    "workflowTemplateName": "org.lexis.common.LEXISTemplate"
    },
  {
    workflowTemplateName: "Test Workflow Template",
    workflowTemplateID: "Test",
    description: "This is the first workflow template",
    inputParameters: [
      {
        inputParamName: "Param_1",
        inputParamType: "String",
        inputParamRequired: true,
        description: "Test input parameter",
        inputParamDefaultValue: "testInput",
      },
      {
        inputParamName: "Param_2",
        inputParamType: "String2",
        inputParamRequired: true,
        description: "Test input parameter2",
        inputParamDefaultValue: "testInput2",
      },
    ],
  },
  {
    workflowTemplateName: "TurboMachineryCloudVisualization",
    workflowTemplateID: "TurboMachineryCloudVisualization:0.1.0-SNAPSHOT",
    description: "This is the second test workflow template",
  },
  {
    description: "Agriculture template",
    inputFiles: null,
    inputParameters: null,
    nodeTemplates: null,
    workflowTemplateID: "org.lexis.wp7.AgricultureTemplate:0.1.0-SNAPSHOT",
    workflowTemplateName: "org.lexis.wp7.AgricultureTemplate"
  }
]

const agriTemplate = require('./wfTemlates/agriculturetemplate.json')

var workflowTemplatesDetail = [
  agriTemplate,
  {
    workflowTemplateName: "Test Workflow Template",
    workflowTemplateID: "Test",
    description: "This is the first workflow template",
    inputFiles: [
      {
        inputFileName: "File_test",
        inputFileType: "zip",
        description: "Test input file",
      },
    ],
    nodeTemplates: [
      {
        nodeName: "Docker_pre",
        tags: [
          {
            key: "task",
            value: "preprocessing",
          },
        ],
      },
      {
        nodeName: "Simulation",
        tags: [
          {
            key: "task",
            value: "computation",
          },
        ],
      },
      {
        nodeName: "Data_transfer",
        tags: [],
      },
      {
        nodeName: "Doker_post",
        tags: [
          {
            key: "task",
            value: "postprocessing",
          },
        ],
      },
    ],
  },
  {
    workflowTemplateName: "TurboMachineryCloudVisualization",
    workflowTemplateID: "TurboMachineryCloudVisualization:0.1.0-SNAPSHOT",
    description: "This is the second test workflow template",
    inputParameters: [
      {
        inputParamName: "visualization_port",
        inputParamType: "integer",
        description: "Port to use",
        inputParamDefaultValue: "8888",
        task: "visualization",
      },
      {
        inputParamName: "token",
        inputParamType: "string",
        description: "Access token",
        inputParamRequired: true,
        inputParamDefaultValue: "<nil>",
        task: "token",
      },
      {
        inputParamName: "preprocessing_ddi_dataset_path",
        inputParamType: "string",
        description: "Dataset path in DDI",
        inputParamRequired: true,
        inputParamDefaultValue: "<nil>",
        task: "preprocessing",
        isDataset: true,
      },
      {
        inputParamName: "visualization_directory",
        inputParamType: "string",
        description: "Directory where visualization data will be stored",
        inputParamDefaultValue: "/vizDirectory",
        task: "visualization",
      },
    ],
    inputFiles: [],
    nodeTemplates: [
      {
        nodeName: "CopyFromJob",
        nodeType: "org.lexis.datatransfer.nodes.CopyFromJob",
        tags: [],
      },
      {
        nodeName: "TRAF",
        nodeType: "org.heappe.nodes.Job",
        tags: [
          {
            key: "task",
            value: "computation",
          },
        ],
      },
      {
        nodeName: "DDIToHPCJob",
        nodeType: "org.ddi.nodes.DDIToHPCJob",
        tags: [
          {
            key: "task",
            value: "preprocessing",
          },
        ],
      },
      {
        nodeName: "PublicNet",
        nodeType: "tosca.nodes.Network",
        tags: [],
      },
      {
        nodeName: "TurbomachineryVM",
        nodeType: "tosca.nodes.Compute",
        tags: [],
      },
      {
        nodeName: "Xrv",
        nodeType: "org.atos.visualization.Xrv",
        tags: [
          {
            key: "task",
            value: "visualization",
          },
        ],
      },
    ],
  },
]

var workflows = [
  {
    workflowID: "testWorkflow",
    workflowName: "Test Workflow",
    projectID: "LEXIS_ID_2",
    creationTime: "2006-01-02 15:04:05",
  },
  {
    workflowID: "GenericWorkflow",
    workflowName: "Generic Workflow",
    projectID: "LEXIS_ID_2",
    creationTime: "2021-09-12 15:04:05",
  },
  {
    workflowID: "turboExample",
    workflowName: "TurboMachineryExample",
    projectID: "LEXIS_ID_1",
    creationTime: "2006-01-02 15:04:05",
    createdBy: "b2bc33c6-5df6-411e-8621-809de31dbc13"
  },
  {
    workflowID: "MyAgriWF-dba509be827318bd7607e68e66d0ecc9afe93b279fee8583d79fc88f7059cb48",
    workflowName: "MyAgriWF",
    creationTime: "8/19/2021, 11:28:51 AM"
  }
]
var workflowDetail = [
  {
    workflowID: "testWorkflow",
    projectID: "LEXIS_ID_2",
    workflowName: "TestWorkflow",
    workflowTemplateID: "TestTemplate",
    description: "This is a test workflow",
    createdBy: "Test User",
    creationTime: "2006-01-02 15:04:05",
    inputParameters: [
      {
        inputParamName: "token",
        inputParamType: "string",
        description: "Access token",
        inputParamRequired: true,
        inputParamDefaultValue: "<nil>",
        task: "token",
      },
      {
        inputParamName: "visualization_directory",
        displayName: "Directory",
        inputParamType: "org.lexis.common.ddi.types.Metadata",
        description: "Directory where visualization data will be stored",
        inputParamDefaultValue: "/vizDirectory",
        task: "preprocessing",
      },
      {
        inputParamName: "computation_heappe_job",
        displayName: "Heappe Job",
        inputParamType: "org.lexis.common.heappe.types.JobSpecification",
        //"inputParamType": "map",
        description: "Description of the HEAppE job/tasks",
        task: "preprocessing",
      },
    ],
    nodeTemplates: [
      {
        nodeName: "Docker_pre",
        tags: [
          {
            key: "task",
            value: "preprocessing",
          },
        ],
      },
      {
        nodeName: "Simulation",
        tags: [
          {
            key: "task",
            value: "computation",
          },
        ],
      },
      {
        nodeName: "Data_transfer",
        tags: [],
      },
      {
        nodeName: "Doker_post",
        tags: [
          {
            key: "task",
            value: "postprocessing",
          },
        ],
      },
    ],
  },
  {
    "createdBy": "f0cdf6fe-7318-4e23-88a3-22b5fd56e421",
    "creationTime": "2021-12-02 19:17:59",
    "description": "Lorem ipsum. ",
    "inputFiles": [],
    "inputParameters": [
      {
        "description": "HEAppE Command Template Name",
        "displayName": "Heappe Command Template Name",
        "inputParamDefaultValue": "\"GenericCommandTemplate\"",
        "inputParamName": "computation_heappe_command_template_name",
        "inputParamType": "string",
        "task": "computation"
      },
      {
        "description": "Description of the HEAppE job/tasks",
        "displayName": "Heappe Job",
        "inputParamDefaultValue": "{\"ClusterId\":\"1\",\"Name\":\"GenericJob\",\"Project\":\"Set by orchestrator\",\"Tasks\":[{\"ClusterNodeTypeId\":\"1\",\"CommandTemplateId\":\"1\",\"LogFile\":\"stdlog\",\"MaxCores\":\"1\",\"MinCores\":\"1\",\"Name\":\"GenericCommandTemplate\",\"Priority\":\"4\",\"ProgressFile\":\"stdprog\",\"StandardErrorFile\":\"stderr\",\"StandardOutputFile\":\"stdout\",\"TemplateParameterValues\":[{\"CommandParameterIdentifier\":\"userScriptPath\",\"ParameterValue\":\"\"}],\"WalltimeLimit\":\"3600\"}]}",
        "inputParamName": "computation_heappe_job",
        "inputParamType": "org.lexis.common.heappe.types.JobSpecification",
        "task": "computation"
      },
      {
        "description": "Relative path to a subddirectoy on the HPC job cluster file system, to stage",
        "displayName": "Hpc Subdirectory To Stage",
        "inputParamDefaultValue": "null",
        "inputParamName": "computation_hpc_subdirectory_to_stage",
        "inputParamType": "string",
        "task": "computation"
      },
      {
        "description": "Metadata for the Computation results dataset to create in DDI",
        "displayName": "Metadata Dataset Result",
        "inputParamDefaultValue": "{\"contributor\":[\"LEXIS worflow\"],\"creator\":[\"LEXIS worflow\"],\"publisher\":[\"LEXIS worflow\"],\"resourceType\":\"Dataset\",\"title\":\"LEXIS computation results\"}",
        "inputParamName": "computation_metadata_dataset_result",
        "inputParamType": "org.lexis.common.ddi.types.Metadata",
        "task": "computation"
      },
      {
        "description": "Postprocessing container environment variables",
        "displayName": "Container Env Vars",
        "inputParamDefaultValue": "{\"INPUT_DIR\":\"/input_dataset\",\"RESULT_DIR\":\"/output\",\"RESULT_FILE_NAME\":\"postprocessing_result.txt\"}",
        //"inputParamDefaultValue": "{}",
        "inputParamName": "postprocessing_container_env_vars",
        "inputParamType": "map",
        "task": "postprocessing"
      },
      {
        "description": "Postprocessing container repository path",
        "displayName": "Container Image",
        "inputParamDefaultValue": "null",
        "inputParamName": "postprocessing_container_image",
        "inputParamRequired": true,
        "inputParamType": "string",
        "task": "postprocessing"
      },
      {
        "description": "List of volumes to mount within the postprocessing container.\nUse docker CLI-style syntax: /host:/container[:mode]",
        "displayName": "Container Volumes",
        "inputParamDefaultValue": "[\"/input_computation_results:/input_dataset\",\"/output_postprocessing:/output\"]",
        "inputParamName": "postprocessing_container_volumes",
        "inputParamType": "list",
        "task": "postprocessing"
      },
      {
        "description": "Path where to transfer the post-processing results in DDI",
        "displayName": "Ddi Project Path",
        "inputParamDefaultValue": "\"project/proj2bdfd9ccf5a78c3ec68ee9e1d90d2c1c\"",
        "inputParamName": "postprocessing_ddi_project_path",
        "inputParamRequired": true,
        "inputParamType": "string",
        "task": "postprocessing"
      },
      {
        "description": "Postprocessing input directory",
        "displayName": "Input Directory",
        "inputParamDefaultValue": "\"/input_computation_results\"",
        "inputParamName": "postprocessing_input_directory",
        "inputParamType": "string",
        "task": "postprocessing"
      },
      {
        "description": "Metadata for the postprocessing results dataset to create in DDI",
        "displayName": "Metadata Dataset Result",
        "inputParamDefaultValue": "{\"contributor\":[\"LEXIS worflow\"],\"creator\":[\"LEXIS worflow\"],\"publisher\":[\"LEXIS worflow\"],\"resourceType\":\"Dataset\",\"title\":\"LEXIS workflow results\"}",
        "inputParamName": "postprocessing_metadata_dataset_result",
        "inputParamType": "org.lexis.common.ddi.types.Metadata",
        "task": "postprocessing"
      },
      {
        "description": "Postprocessing output directory",
        "displayName": "Output Directory",
        "inputParamDefaultValue": "\"/output_postprocessing\"",
        "inputParamName": "postprocessing_output_directory",
        "inputParamType": "string",
        "task": "postprocessing"
      },
      {
        "description": "List of sites where the result dataset should be available (example: it4i, lrz)",
        "displayName": "Result Dataset Replication Sites",
        "inputParamDefaultValue": "[]",
        "inputParamName": "postprocessing_result_dataset_replication_sites",
        "inputParamType": "list",
        "task": "postprocessing"
      },
      {
        "description": "Preprocessing container environment variables",
        "displayName": "Container Env Vars",
        "inputParamDefaultValue": "{\"INPUT_DIR\":\"/input_dataset\",\"RESULT_DIR\":\"/output\",\"RESULT_FILE_NAME\":\"preprocessing_result.txt\"}",
        "inputParamName": "preprocessing_container_env_vars",
        "inputParamType": "map",
        "task": "preprocessing"
      },
      {
        "description": "Preprocessing container repository path",
        "displayName": "Container Image",
        "inputParamDefaultValue": "null",
        "inputParamName": "preprocessing_container_image",
        "inputParamRequired": true,
        "inputParamType": "string",
        "task": "preprocessing"
      },
      {
        "description": "List of volumes to mount within the preprocessing container.\nUse docker CLI-style syntax: /host:/container[:mode]",
        "displayName": "Container Volumes",
        "inputParamDefaultValue": "[\"/mnt/lexis_test:/input_dataset\",\"/lexistest/output:/output\"]",
        "inputParamName": "preprocessing_container_volumes",
        "inputParamType": "list",
        "task": "preprocessing"
      },
      {
        "description": "Dataset containing input data",
        "displayName": "Input Path",
        "inputParamDefaultValue": "null",
        "inputParamName": "preprocessing_dataset_path_input_path",
        "inputParamRequired": true,
        "inputParamType": "string",
        "isDatasetPath": true,
        "task": "preprocessing"
      },
      {
        "description": "Directory on the compute instance where to mount the dataset",
        "displayName": "Mount Point Input Dataset",
        "inputParamDefaultValue": "\"/mnt/lexis_test\"",
        "inputParamName": "preprocessing_mount_point_input_dataset",
        "inputParamType": "string",
        "task": "preprocessing"
      },
      {
        "description": "Preprocessing output directory",
        "displayName": "Output Directory",
        "inputParamDefaultValue": "\"/lexistest/output\"",
        "inputParamName": "preprocessing_output_directory",
        "inputParamType": "string",
        "task": "preprocessing"
      },
      {
        "description": "Compress the result dataset",
        "displayName": "Compress Dataset Result",
        "inputParamDefaultValue": "\"false\"",
        "inputParamName": "postprocessing_compress_dataset_result",
        "inputParamType": "boolean",
        "task": "postprocessing"
      },
      {
        "description": "Encrypt the result dataset",
        "displayName": "Encrypt Dataset Result",
        "inputParamDefaultValue": "\"false\"",
        "inputParamName": "postprocessing_encrypt_dataset_result",
        "inputParamType": "boolean",
        "task": "postprocessing"
      },
      {
        "description": "Should the input dataset be decrypted",
        "displayName": "Decrypt Dataset Input",
        "inputParamDefaultValue": "\"false\"",
        "inputParamName": "preprocessing_decrypt_dataset_input",
        "inputParamType": "boolean",
        "task": "preprocessing"
      },
      {
        "description": "Should the input dataset be uncompressed",
        "displayName": "Uncompress Dataset Input",
        "inputParamDefaultValue": "\"false\"",
        "inputParamName": "preprocessing_uncompress_dataset_input",
        "inputParamType": "boolean",
        "task": "preprocessing"
      }
    ],
    "nodeTemplates": [
      {
        "nodeName": "ValidateExchangeToken",
        "nodeType": "org.lexis.common.dynamic.orchestration.nodes.ValidateAndExchangeToken",
        "tags": []
      },
      {
        "nodeName": "Docker",
        "nodeType": "org.ystia.docker.ansible.nodes.Docker",
        "tags": []
      },
      {
        "nodeName": "CloudToDDIJob",
        "nodeType": "org.lexis.common.ddi.nodes.CloudToDDIJob",
        "tags": []
      },
      {
        "nodeName": "ReplicateDatasetJob",
        "nodeType": "org.lexis.common.ddi.nodes.ReplicateDatasetJob",
        "tags": []
      },
      {
        "nodeName": "GetDDIAccess",
        "nodeType": "org.lexis.common.ddi.nodes.DDIAccess",
        "tags": []
      },
      {
        "nodeName": "HPCJob",
        "nodeType": "org.lexis.common.heappe.nodes.Job",
        "tags": [
          {
            "key": "task",
            "value": "computation"
          }
        ]
      },
      {
        "nodeName": "CreatePreProcessDirs",
        "nodeType": "org.lexis.common.datatransfer.nodes.CreateDirectories",
        "tags": []
      },
      {
        "nodeName": "PreprocessingContainer",
        "nodeType": "org.ystia.docker.containers.docker.generic.nodes.GenericContainer",
        "tags": [
          {
            "key": "task",
            "value": "preprocessing"
          }
        ]
      },
      {
        "nodeName": "CloudToHPCTaskJob",
        "nodeType": "org.lexis.common.ddi.nodes.CloudToHPCJob",
        "tags": []
      },
      {
        "nodeName": "HPCToDDIJob",
        "nodeType": "org.lexis.common.ddi.nodes.HPCToDDIJob",
        "tags": []
      },
      {
        "nodeName": "CleanupCloudStagingAreaInputsJob",
        "nodeType": "org.lexis.common.ddi.nodes.DeleteCloudDataJob",
        "tags": []
      },
      {
        "nodeName": "MountInputDataset",
        "nodeType": "org.lexis.common.ddi.nodes.SSHFSMountStagingAreaDataset",
        "tags": []
      },
      {
        "nodeName": "StageHPCInputs",
        "nodeType": "org.lexis.common.datatransfer.nodes.CopyToStagingAreaDirectory",
        "tags": []
      },
      {
        "nodeName": "RefreshVMToken",
        "nodeType": "org.lexis.common.dynamic.orchestration.nodes.RefreshTargetTokens",
        "tags": []
      },
      {
        "nodeName": "FindCloudLocation",
        "nodeType": "org.lexis.common.dynamic.orchestration.nodes.SetLocationsJob",
        "tags": [
          {
            "key": "task",
            "value": "dynamic_orchestration"
          }
        ]
      },
      {
        "nodeName": "HPCToCloudJob",
        "nodeType": "org.lexis.common.ddi.nodes.HPCToCloudJob",
        "tags": []
      },
      {
        "nodeName": "MountHPCResultsDataset",
        "nodeType": "org.lexis.common.ddi.nodes.SSHFSMountStagingAreaDataset",
        "tags": []
      },
      {
        "nodeName": "CreatePostProcessDirs",
        "nodeType": "org.lexis.common.datatransfer.nodes.CreateDirectories",
        "tags": []
      },
      {
        "nodeName": "CreateStagingAreaResultDir",
        "nodeType": "org.lexis.common.datatransfer.nodes.CreateStagingAreaDirectory",
        "tags": []
      },
      {
        "nodeName": "DDIToCloudInputDatasetJob",
        "nodeType": "org.lexis.common.ddi.nodes.DDIToCloudJob",
        "tags": []
      },
      {
        "nodeName": "GetPreprocessDatasetInfo",
        "nodeType": "org.lexis.common.ddi.nodes.GetComputeInstanceDatasetInfo",
        "tags": []
      },
      {
        "nodeName": "StagePostProcessingResults",
        "nodeType": "org.lexis.common.datatransfer.nodes.CopyToStagingAreaDirectory",
        "tags": []
      },
      {
        "nodeName": "InputDatasetInfoJob",
        "nodeType": "org.lexis.common.ddi.nodes.GetDDIDatasetInfoJob",
        "tags": []
      },
      {
        "nodeName": "Network",
        "nodeType": "yorc.nodes.openstack.FloatingIP",
        "tags": []
      },
      {
        "nodeName": "ComputeInstance",
        "nodeType": "tosca.nodes.Compute",
        "tags": []
      },
      {
        "nodeName": "FindHPCLocationJob",
        "nodeType": "org.lexis.common.dynamic.orchestration.nodes.SetLocationsJob",
        "tags": [
          {
            "key": "task",
            "value": "dynamic_orchestration"
          }
        ]
      },
      {
        "nodeName": "CreateStagingAreaHPCInputDir",
        "nodeType": "org.lexis.common.datatransfer.nodes.CreateStagingAreaDirectory",
        "tags": []
      },
      {
        "nodeName": "MoveHPCResults",
        "nodeType": "org.lexis.common.datatransfer.nodes.MoveFile",
        "tags": []
      },
      {
        "nodeName": "PostprocessingContainer",
        "nodeType": "org.ystia.docker.containers.docker.generic.nodes.GenericContainer",
        "tags": [
          {
            "key": "task",
            "value": "postprocessing"
          }
        ]
      },
      {
        "nodeName": "CleanupCloudStagingAreaHPCJob",
        "nodeType": "org.lexis.common.ddi.nodes.DeleteCloudDataJob",
        "tags": []
      }
    ],
    "projectID": "LEXIS_ID_2",
    "projectName": "TWO 2 2",
    "projectShortName": "lexis_weather",
    "workflowID": "GenericWorkflow",
    "workflowName": "Generic Workflow",
    "workflowTemplateID": "org.lexis.common.LEXISTemplate:0.1.0-SNAPSHOT"
  },
  {
    workflowID: "turboExample",
    projectID: "LEXIS_ID_2",
    projectName: "TWO 2 2",
    projectShortName: "lexis_weather",
    createdBy: "b2bc33c6-5df6-411e-8621-809de31dbc13",
    workflowName: "TurboMachineryExample",
    workflowTemplateID: "TurboMachineryCloudVisualization:0.1.0-SNAPSHOT",
    description: "This is a test workflow on dummy server again",
    inputParameters: [
      {
        inputParamName: "preprocessing_ddi_dataset_path",
        displayName: "DDI Path",
        inputParamType: "string",
        description: "Dataset path in DDI",
        inputParamRequired: true,
        inputParamDefaultValue: "public/proje696f89dda5d9c4ed1aa35b30a1c7a38/76e39e3c-0e40-4cf6-9d90-f1c2862ce435/my folder/risico/risico_202006290000.nc",
        task: "preprocessing",
        isDataset: true,
        isDatasetFile: true
      },
      {
        inputParamName: "preprocessing_ddi_2_dataset_path",
        displayName: "DDI Path 2nd",
        inputParamType: "string",
        description: "Dataset path 2nd in DDI",
        inputParamRequired: true,
        inputParamDefaultValue: "project/projb62bd396-2cd1-48c1-8e25-4543130e60bc/76e39e3c-0e40-4cf6-9d90-f1c2862ce435",
        task: "preprocessing",
        isDataset: true,
      },
      {
        inputParamName: "preprocessing_ddi_dataset",
        displayName: "DDI ID",
        inputParamType: "string",
        description: "Dataset path in DDI",
        inputParamRequired: true,
        inputParamDefaultValue: "a5b8ddbe-6054-4cb7-98ff-e678b6eba7f4",
        task: "preprocessing",
        isDataset: true,
        isDatasetId: true,
      },
      {
        inputParamName: "preprocessing_ddi_dataset_2",
        displayName: "DDI ID",
        inputParamType: "string",
        description: "Dataset path in DDI 2",
        inputParamRequired: true,
        inputParamDefaultValue: "<nil>",
        task: "preprocessing",
        isDataset: true,
        isDatasetId: true,
      },
      {
        inputParamName: "Dataset",
        inputParamValue: "/path/to/dataset",
      },
      {
        inputParamName: "visualization_port",
        inputParamValue: "8888",
      },
      {
        inputParamName: "visualization_directory",
        inputParamValue: "/turbomachinery",
      },
    ],
    nodeTemplates: [
      {
        nodeName: "CopyFromJob",
        nodeType: "org.lexis.datatransfer.nodes.CopyFromJob",
        tags: [],
      },
      {
        nodeName: "TRAF",
        nodeType: "org.heappe.nodes.Job",
        tags: [
          {
            key: "task",
            value: "computation",
          },
        ],
      },
      {
        nodeName: "DDIToHPCJob",
        nodeType: "org.ddi.nodes.DDIToHPCJob",
        tags: [
          {
            key: "task",
            value: "preprocessing",
          },
        ],
      },
      {
        nodeName: "PublicNet",
        nodeType: "tosca.nodes.Network",
        tags: [],
      },
      {
        nodeName: "TurbomachineryVM",
        nodeType: "tosca.nodes.Compute",
        tags: [],
      },
      {
        nodeName: "Xrv",
        nodeType: "org.atos.visualization.Xrv",
        tags: [
          {
            key: "task",
            value: "visualization",
          },
        ],
      },
    ],
  },
  require('./wfDetails/agricultureDetail.json')
]

var workflowExecutions = [
  {
    workflowExecutionID: "LEXIS_WFE_1",
    workflowExecutionName: "LEXIS_WFE_Name_1",
    workflowExecutionStatus: "Running",
    test: "",
    creationTime: "2006-01-02 15:04:05",
  },
  {
    workflowExecutionID: "LEXIS_WFE_2",
    workflowExecutionName: "LEXIS_WFE_Name_2",
    workflowExecutionStatus: "Cancelled",
    creationTime: "2006-01-02 15:04:05",
  },
  {
    workflowExecutionID: "LEXIS_WFE_3",
    workflowExecutionName: "LEXIS_WFE_Name_3",
    creationTime: "2006-01-02 15:04:05",
  },
]
var workflowExecutionDetail = [
  {
    workflowExecutionID: "LEXIS_WFE_1",
    workflowExecutionName: "LEXIS_WFE_Name_1",
    workflowExecutionStatus: "Running",
    createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    creationTime: "2006-01-02 15:04:05",
    outputProperties: [
      {
        nodeName: "XRV",
        attributeName: "URL",
        attributeValue: "www.test.ie",
      },
    ],
    inputParameters: [
      {
        inputParamName: "visualization_directory",
        inputParamValue: "/testDirectory",
        displayName: "Directory",
        inputParamType: "string",
        description: "Directory where visualization data will be stored",
        inputParamDefaultValue: "/vizDirectory",
        task: "visualization",
      },
    ],
  },
  {
    workflowExecutionID: "LEXIS_WFE_2",
    workflowExecutionName: "LEXIS_WFE_Name_2",
    workflowExecutionStatus: "Cancelled",
    createdBy: "Test User",
    creationTime: "2006-01-02 15:04:05",
  },
  {
    workflowExecutionID: "LEXIS_WFE_3",
    workflowExecutionName: "LEXIS_WFE_Name_3",
    createdBy: "Test User",
    creationTime: "2006-01-02 15:04:05",
  },
]

var workflowExecutionLogs = [
  {
    workflowExecutionID: "LEXIS_WFE_1",
    deploymentID: "DeploymentID",
    timestamp: "2021-08-27T19:48:21Z",
    content: "This is log message 1",
  },
  {
    workflowExecutionID: "LEXIS_WFE_1",
    deploymentID: "DeploymentID",
    timestamp: "2021-08-27T19:48:23Z",
    content: "This is log message 2",
  },
  {
    workflowExecutionID: "LEXIS_WFE_1",
    deploymentID: "DeploymentID",
    timestamp: "2021-08-27T19:48:26Z",
    content: "This is log message 3",
  },
]

var workflowExecutionStepStatus = [
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.DelegateWorkflowActivity",
    ],
    nodeName: "TurbomachineryVM",
    precedingSteps: ["TRAF_executed"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TurbomachineryVM_install",
    succeedingSteps: ["CreateVisualizationDir_start", "Xrv_initial"],
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["Start"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_create",
    succeedingSteps: ["TRAF_enable_file_transfer"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_configuring"],
    step: "Xrv_configured",
    succeedingSteps: ["Xrv_starting"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_starting"],
    status: "COMPLETED_SUCCESSFULL",
    step: "Xrv_start",
    succeedingSteps: ["Xrv_started"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "DDIToHPCJob",
    precedingSteps: ["DDIToHPCJob_submit"],
    step: "DDIToHPCJob_submitted",
    succeedingSteps: ["DDIToHPCJob_run"],
    task: "preprocessing",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["TRAF_run"],
    step: "TRAF_executed",
    succeedingSteps: ["TurbomachineryVM_install", "CopyFromJob_start"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["CopyFromJob_started"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_disable_file_transfer",
    succeedingSteps: ["TRAF_delete"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_create"],
    step: "Xrv_created",
    succeedingSteps: ["Xrv_configuring"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "CreateVisualizationDir",
    precedingSteps: ["CreateVisualizationDir_start"],
    step: "CreateVisualizationDir_started",
    succeedingSteps: ["CopyFromJob_start"],
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "CopyFromJob",
    precedingSteps: ["CreateVisualizationDir_started", "TRAF_executed"],
    status: "COMPLETED_SUCCESSFULL",
    step: "CopyFromJob_start",
    succeedingSteps: ["CopyFromJob_started"],
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "CreateVisualizationDir",
    precedingSteps: ["TurbomachineryVM_install"],
    status: "COMPLETED_SUCCESSFULL",
    step: "CreateVisualizationDir_start",
    succeedingSteps: ["CreateVisualizationDir_started"],
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["TurbomachineryVM_install"],
    step: "Xrv_initial",
    succeedingSteps: ["Xrv_creating"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["TRAF_create"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_enable_file_transfer",
    succeedingSteps: ["DDIToHPCJob_create"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["DDIToHPCJob_executed"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_submit",
    succeedingSteps: ["TRAF_submitted"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "DDIToHPCJob",
    precedingSteps: ["DDIToHPCJob_submitted"],
    status: "COMPLETED_SUCCESSFULL",
    step: "DDIToHPCJob_run",
    succeedingSteps: ["DDIToHPCJob_executed"],
    task: "preprocessing",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "DDIToHPCJob",
    precedingSteps: ["DDIToHPCJob_run"],
    step: "DDIToHPCJob_executed",
    succeedingSteps: ["TRAF_submit"],
    task: "preprocessing",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["TRAF_submitted"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_run",
    succeedingSteps: ["TRAF_executed"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["TRAF_disable_file_transfer"],
    status: "COMPLETED_SUCCESSFULL",
    step: "TRAF_delete",
    succeedingSteps: ["Finish"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_created"],
    step: "Xrv_configuring",
    succeedingSteps: ["Xrv_configured"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "DDIToHPCJob",
    precedingSteps: ["TRAF_enable_file_transfer"],
    status: "COMPLETED_SUCCESSFULL",
    step: "DDIToHPCJob_create",
    succeedingSteps: ["DDIToHPCJob_submit"],
    task: "preprocessing",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_configured"],
    step: "Xrv_starting",
    succeedingSteps: ["Xrv_start"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "CopyFromJob",
    precedingSteps: ["CopyFromJob_start"],
    step: "CopyFromJob_started",
    succeedingSteps: ["TRAF_disable_file_transfer"],
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_initial"],
    step: "Xrv_creating",
    succeedingSteps: ["Xrv_create"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "DDIToHPCJob",
    precedingSteps: ["DDIToHPCJob_create"],
    status: "COMPLETED_SUCCESSFULL",
    step: "DDIToHPCJob_submit",
    succeedingSteps: ["DDIToHPCJob_submitted"],
    task: "preprocessing",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "TRAF",
    precedingSteps: ["TRAF_submit"],
    step: "TRAF_submitted",
    succeedingSteps: ["TRAF_run"],
    task: "computation",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.CallOperationWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_creating"],
    status: "COMPLETED_SUCCESSFULL",
    step: "Xrv_create",
    succeedingSteps: ["Xrv_created"],
    task: "vsualization",
  },
  {
    activityType: [
      "org.alien4cloud.tosca.model.workflow.activities.SetStateWorkflowActivity",
    ],
    nodeName: "Xrv",
    precedingSteps: ["Xrv_start"],
    step: "Xrv_started",
    succeedingSteps: ["Finish"],
    task: "vsualization",
  },
  {
    activityType: null,
    precedingSteps: null,
    status: "COMPLETED_SUCCESSFULL",
    step: "Start",
    succeedingSteps: ["TRAF_create"],
  },
  {
    activityType: null,
    precedingSteps: ["TRAF_delete", "Xrv_started"],
    status: "COMPLETED_SUCCESSFULL",
    step: "Finish",
    succeedingSteps: null,
  },
]

// `GET /hpc/resource` - list all HPCResources
var listOfHPCresources = [
  {
    ApprovalStatus: "ACCEPTED",
    AssociatedLEXISProject: "LEXIS_ID_2",
    HEAppEEndpoint: "https://heappe.lexis.lrz.de/lexisdemo",
    HPCResourceID: "d3c47876-7367-8ea5-1fd5-bc7862a703dd",
    TermsConsent: true,
    AssociatedHPCProject: "di46sov",
    HPCProvider: "LRZ",
    ResourceType: "HPC",
  },
  {
    ApprovalStatus: "ACCEPTED",
    AssociatedLEXISProject: "LEXIS_ID_1",
    CloudNetworkName: "vlan104_lexis",
    HEAppEEndpoint: "https://heappe.it4i.cz/lexisdemo",
    HPCResourceID: "14115a0e-f76e-5da5-1840-011292c54614",
    OpenStackEndpoint: "https://openstack.msad.it4i.lexis.tech",
    OpenStackProjectID: "ea951dd56bbf410484a3b2fbdfb59047",
    ProjectNetworkName: "open-23-1_network",
    TermsConsent: true,
    AssociatedHPCProject: "OPEN-23-1",
    HPCProvider: "IT4I",
    ResourceType: "CLOUD",
  },
  {
    ApprovalStatus: "ACCEPTED",
    AssociatedLEXISProject: "LEXIS_ID_2",
    CloudNetworkName: "internet_pool",
    HEAppEEndpoint: "https://heappe.lexis.lrz.de/lexisdemo",
    HPCResourceID: "8001c68f-cdcc-9eaf-496c-408d1ae405ce",
    OpenStackEndpoint: "https://cc.lrz.de",
    OpenStackProjectID: "38c3cede95a2470c8c2410d9a40d7e75",
    TermsConsent: true,
    AssociatedHPCProject: "di46sov",
    HPCProvider: "LRZ",
    ResourceType: "CLOUD",
  },
  {
    ApprovalStatus: "ACCEPTED",
    AssociatedLEXISProject: "00cbfc3d-8eb0-9496-9633-89d4f6d890ae",
    HEAppEEndpoint: "https://heappe.it4i.cz/lexisdemo",
    HPCResourceID: "6c12efc0-e2c9-3389-003d-57ee21ccade3",
    TermsConsent: true,
    AssociatedHPCProject: "OPEN-23-1",
    HPCProvider: "IT4I",
    ResourceType: "HPC",
  },
  {
    ApprovalStatus: "REJECTED",
    AssociatedLEXISProject: "LEXIS_ID_2",
    HEAppEEndpoint: undefined,
    HPCResourceID: "0626fb2c-dc1b-49b3-a96d-8d2ec0182138",
    TermsConsent: true,
    AssociatedHPCProject: "RE-JE-CT",
    HPCProvider: "IT4I",
    ResourceType: "CLOUD",
  },
];


const availableClusters = [
  {
      "Description": "IT4Innovations Barbora cluster",
      "ID": 1,
      "Name": "Barbora",
      "NodeTypes": [
          {
              "CommandTemplates": [],
              "CoresPerNode": 36,
              "Description": "Standard production nodes",
              "ID": 1,
              "MaxWallTime": 172800,
              "Name": "Production",
              "NumberOfNodes": 192
          },
          {
              "CommandTemplates": [
                  {
                      "Code": "TestTemplate",
                      "Description": "TestTemplate",
                      "ID": 1,
                      "Name": "TestTemplate",
                      "TemplateParameters": [
                          {
                              "Description": "inputParam",
                              "Identifier": "inputParam"
                          }
                      ]
                  }
              ],
              "CoresPerNode": 36,
              "Description": "Testing nodes",
              "ID": 2,
              "MaxWallTime": 3600,
              "Name": "Express",
              "NumberOfNodes": 16
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 24,
              "Description": "GPU accelerated nodes",
              "ID": 3,
              "MaxWallTime": 172800,
              "Name": "GPU",
              "NumberOfNodes": 8
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 36,
              "Description": "Long production nodes",
              "ID": 4,
              "MaxWallTime": 518400,
              "Name": "LONG",
              "NumberOfNodes": 60
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 128,
              "Description": "FAT nodes",
              "ID": 5,
              "MaxWallTime": 518400,
              "Name": "FAT",
              "NumberOfNodes": 1
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 32,
              "Description": "Vizualization",
              "ID": 6,
              "MaxWallTime": 28800,
              "Name": "Viz",
              "NumberOfNodes": 2
          }
      ]
  },
  {
      "Description": "IT4Innovations Karolina cluster",
      "ID": 2,
      "Name": "Karolina",
      "NodeTypes": [
          {
              "CommandTemplates": [
                  {
                      "Code": "SOMCommandTemplate",
                      "Description": "Command template for SOM",
                      "ID": 5,
                      "Name": "SOM",
                      "TemplateParameters": [
                          {
                              "Description": "Grid size X",
                              "Identifier": "grid_size_x"
                          },
                          {
                              "Description": "Grid size Y",
                              "Identifier": "grid_size_y"
                          },
                          {
                              "Description": "Input filename",
                              "Identifier": "input_filename"
                          }
                      ]
                  }
              ],
              "CoresPerNode": 128,
              "Description": "Standard production nodes",
              "ID": 7,
              "MaxWallTime": 172800,
              "Name": "Production",
              "NumberOfNodes": 756
          },
          {
              "CommandTemplates": [
                  {
                      "Code": "TestTemplate",
                      "Description": "TestTemplate",
                      "ID": 3,
                      "Name": "TestTemplate",
                      "TemplateParameters": [
                          {
                              "Description": "inputParam",
                              "Identifier": "inputParam"
                          }
                      ]
                  },
                  {
                      "Code": "GenericCommandTemplate",
                      "Description": "Command template for generic job",
                      "ID": 4,
                      "Name": "GenericCommandTemplate",
                      "TemplateParameters": [
                          {
                              "Description": "userScriptPath",
                              "Identifier": "userScriptPath"
                          }
                      ]
                  }
              ],
              "CoresPerNode": 128,
              "Description": "Testing nodes",
              "ID": 8,
              "MaxWallTime": 3600,
              "Name": "Express",
              "NumberOfNodes": 32
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 64,
              "Description": "GPU accelerated nodes",
              "ID": 9,
              "MaxWallTime": 172800,
              "Name": "GPU",
              "NumberOfNodes": 72
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 128,
              "Description": "Free nodes",
              "ID": 10,
              "MaxWallTime": 43200,
              "Name": "Free",
              "NumberOfNodes": 756
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 128,
              "Description": "Long production nodes",
              "ID": 11,
              "MaxWallTime": 518400,
              "Name": "LONG",
              "NumberOfNodes": 20
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 768,
              "Description": "FAT nodes",
              "ID": 12,
              "MaxWallTime": 172800,
              "Name": "FAT",
              "NumberOfNodes": 1
          },
          {
              "CommandTemplates": [],
              "CoresPerNode": 128,
              "Description": "Vizualization nodes",
              "ID": 13,
              "MaxWallTime": 28800,
              "Name": "VIZ",
              "NumberOfNodes": 2
          }
      ]
  }
]

module.exports = {
  list,
  users,
  projects,
  dataset_staging_info,
  dataset_staging_stage,
  dataset_multipart,
  dataset_multipart_result,
  dataset_staging_stage_delete,
  dataset_staging_datasize,
  dataset_staging_datasize_result,
  dataset_staging_stage_result,
  dataset_staging_stage_delete_result,
  dataset_sshfsexport,
  getDatasetFiles,
  dataset_stored,
  dataset_stage_result_key,
  dataset_deleted_stored,
  datasetsMetadataQueryResponse,
  dataset_tusuploadloc,
  workflowTemplates,
  workflowTemplatesDetail,
  workflows,
  workflowDetail,
  workflowExecutions,
  workflowExecutionDetail,
  workflowExecutionLogs,
  workflowExecutionStepStatus,
  uuidv4,
  organizationID,
  hpcresources,
  dynamicResourcesSelection,
  hpcResourceRequestsSentBackFromApproval,
  usageManagementProjectsArray,
  hpcApprovedResourceRequestsSentBackFromApproval,
  projectUsers,
  listOfHPCresources,
  userPermissions,
  availableClusters
}
