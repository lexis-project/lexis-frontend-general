import reducer from "../../modules/data-sets/data-sets-reducer";

describe("Should request organizations reducer", () => {
    it("has a default state", () => {
        expect(reducer(undefined, { type: "unexpected" })).toEqual({
            list: []
        });
    });

    it("has a onListFetched", () => {
        expect(
            reducer(
                {
                    list: []
                },
                {
                    type: "DATASETS_LIST_FETCHED",
                    ids: [0, 1, 2]
                }
            )
        ).toEqual({
            list: [0, 1, 2]
        });
    });
});
