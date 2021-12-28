import entityReducer from "../../modules/entity-repository/entity-repository-reducer";

describe("Should request entity repository reducer", () => {
    it("has a default state", () => {
        expect(entityReducer(undefined, { type: "unexpected" })).toEqual({
            organizations: {},
            users: {}
        });
    });

    it("has a repositoryHasChanged", () => {
        expect(
            entityReducer(
                {
                    organizations: {},
                    users: {}
                },
                {
                    type: "ENTITY_REPOSITORY/REPOSITORY_HAS_CHANGED",
                    repository: {
                        organizations: {
                            "0": {
                                id: 0,
                                formalName: "Koffee",
                                registeredAddress1: "Judge Street",
                                registeredAddress2: "912 35",
                                registeredAddress3: "Iberia",
                                registeredCountry: "Burundi",
                                creationDate: 1563371850596,
                                createdBy: "David Hruby",
                                website: "https://dolore.com/",
                                organizationEmailAddress: "Mayer.Mitchell@elit.com",
                                primaryTelephoneNumber: "860 441 366"
                            },
                            "1": {
                                id: 1,
                                formalName: "Acruex",
                                registeredAddress1: "Concord Street",
                                registeredAddress2: "593 12",
                                registeredAddress3: "Kaka",
                                registeredCountry: "Afghanistan",
                                creationDate: 1563371850596,
                                createdBy: "David Hruby",
                                website: "https://voluptate.com/",
                                organizationEmailAddress: "Diann.Downs@magna.com",
                                primaryTelephoneNumber: "999 516 292"
                            },
                            "2": {
                                id: 2,
                                formalName: "Sustenza",
                                registeredAddress1: "Bethel Loop",
                                registeredAddress2: "261 38",
                                registeredAddress3: "Sylvanite",
                                registeredCountry: "Bolivia",
                                creationDate: 1563371850596,
                                createdBy: "David Hruby",
                                website: "https://dolor.com/",
                                organizationEmailAddress: "Mattie.Shaw@sit.com",
                                primaryTelephoneNumber: "959 531 384"
                            },
                            "3": {
                                id: 3,
                                formalName: "Infotrips",
                                registeredAddress1: "Hastings Street",
                                registeredAddress2: "714 86",
                                registeredAddress3: "Abiquiu",
                                registeredCountry: "Belize",
                                creationDate: 1563371850596,
                                createdBy: "David Hruby",
                                website: "https://laborum.com/",
                                organizationEmailAddress: "Stevens.Haynes@veniam.com",
                                primaryTelephoneNumber: "958 407 278"
                            }
                        },
                        users: {
                            "0": {
                                id: 0,
                                firstname: "Tania",
                                lastname: "Rich"
                            },
                            "1": {
                                id: 1,
                                firstname: "Luann",
                                lastname: "Warren"
                            },
                            "2": {
                                id: 2,
                                firstname: "Stark",
                                lastname: "Richmond"
                            },
                            "3": {
                                id: 3,
                                firstname: "Patricia",
                                lastname: "Calhoun"
                            }
                        }
                    }
                }
            )
        ).toEqual({
            organizations: {
                "0": {
                    id: 0,
                    formalName: "Koffee",
                    registeredAddress1: "Judge Street",
                    registeredAddress2: "912 35",
                    registeredAddress3: "Iberia",
                    registeredCountry: "Burundi",
                    creationDate: 1563371850596,
                    createdBy: "David Hruby",
                    website: "https://dolore.com/",
                    organizationEmailAddress: "Mayer.Mitchell@elit.com",
                    primaryTelephoneNumber: "860 441 366"
                },
                "1": {
                    id: 1,
                    formalName: "Acruex",
                    registeredAddress1: "Concord Street",
                    registeredAddress2: "593 12",
                    registeredAddress3: "Kaka",
                    registeredCountry: "Afghanistan",
                    creationDate: 1563371850596,
                    createdBy: "David Hruby",
                    website: "https://voluptate.com/",
                    organizationEmailAddress: "Diann.Downs@magna.com",
                    primaryTelephoneNumber: "999 516 292"
                },
                "2": {
                    id: 2,
                    formalName: "Sustenza",
                    registeredAddress1: "Bethel Loop",
                    registeredAddress2: "261 38",
                    registeredAddress3: "Sylvanite",
                    registeredCountry: "Bolivia",
                    creationDate: 1563371850596,
                    createdBy: "David Hruby",
                    website: "https://dolor.com/",
                    organizationEmailAddress: "Mattie.Shaw@sit.com",
                    primaryTelephoneNumber: "959 531 384"
                },
                "3": {
                    id: 3,
                    formalName: "Infotrips",
                    registeredAddress1: "Hastings Street",
                    registeredAddress2: "714 86",
                    registeredAddress3: "Abiquiu",
                    registeredCountry: "Belize",
                    creationDate: 1563371850596,
                    createdBy: "David Hruby",
                    website: "https://laborum.com/",
                    organizationEmailAddress: "Stevens.Haynes@veniam.com",
                    primaryTelephoneNumber: "958 407 278"
                }
            },
            users: {
                "0": {
                    id: 0,
                    firstname: "Tania",
                    lastname: "Rich"
                },
                "1": {
                    id: 1,
                    firstname: "Luann",
                    lastname: "Warren"
                },
                "2": {
                    id: 2,
                    firstname: "Stark",
                    lastname: "Richmond"
                },
                "3": {
                    id: 3,
                    firstname: "Patricia",
                    lastname: "Calhoun"
                }
            }
        });
    });
});
