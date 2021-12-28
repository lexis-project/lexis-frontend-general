import Actions from "../../modules/entity-repository/entity-repository-actions";

describe("should do all actions with component entity-repository", () => {
    it("should update repository", () => {
        const data = {
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
                }
            },
            users: {
                "0": {
                    id: 0,
                    firstname: "Tania",
                    lastname: "Rich"
                }
            }
        };

        const expectedAction = {
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
                    }
                },
                users: {
                    "0": {
                        id: 0,
                        firstname: "Tania",
                        lastname: "Rich"
                    }
                }
            }
        };

        expect(Actions.Creators.repositoryHasChanged(data)).toEqual(expectedAction);
    });
});
