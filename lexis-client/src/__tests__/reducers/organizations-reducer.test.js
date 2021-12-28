import organizationsReducer from "../../modules/organizations/organizations-reducer";

describe("Should request organizations reducer", () => {
    it("has a default state", () => {
        expect(organizationsReducer(undefined, { type: "unexpected" })).toEqual({
            list: []
        });
    });

    it("has a onListFetched", () => {
        expect(
            organizationsReducer(
                {
                    list: []
                },
                {
                    type: "ORGANIZATIONS_LIST_FETCHED",
                    ids: [0, 1, 2]
                }
            )
        ).toEqual({
            list: [0, 1, 2]
        });
    });
});
