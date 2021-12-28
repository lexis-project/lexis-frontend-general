import Actions from "../../modules/organizations/organizations-actions";

describe("should do all actions with organizations component", () => {
    it("should fetch list of organization ids", () => {
        const reqData = [0, 1, 2];
        const expectedAction = {
            type: "ORGANIZATIONS_LIST_FETCHED",
            ids: [0, 1, 2]
        };
        expect(Actions.Creators.listFetched(reqData)).toEqual(expectedAction);
    });

    it("should create new organization", () => {
        const reqData = {
            formalName: "Koffee",
            registeredAddress1: "Judge Street",
            registeredAddress2: "912 35",
            registeredAddress3: "Iberia",
            registeredCountry: "Burundi",
            website: "https://dolore.com/",
            organizationEmailAddress: "Mayer.Mitchell@elit.com",
            primaryTelephoneNumber: "860 441 366"
        };
        const expectedAction = {
            type: "ORGANIZATIONS_CREATE",
            data: {
                formalName: "Koffee",
                registeredAddress1: "Judge Street",
                registeredAddress2: "912 35",
                registeredAddress3: "Iberia",
                registeredCountry: "Burundi",
                website: "https://dolore.com/",
                organizationEmailAddress: "Mayer.Mitchell@elit.com",
                primaryTelephoneNumber: "860 441 366"
            }
        };
        expect(Actions.Creators.create(reqData)).toEqual(expectedAction);
    });

    it("should update organization", () => {
        const reqData = {
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
        };
        const expectedAction = {
            type: "ORGANIZATIONS_UPDATE",
            data: {
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
        };
        expect(Actions.Creators.update(reqData)).toEqual(expectedAction);
    });
    it("should remove organization", () => {
        const reqData = 49;
        const expectedAction = {
            type: "ORGANIZATIONS_REMOVE",
            id: 49
        };
        expect(Actions.Creators.remove(reqData)).toEqual(expectedAction);
    });
});
