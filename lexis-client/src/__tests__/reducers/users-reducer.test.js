import usersReducer from "../../modules/users/users-reducer";

describe("Should request users reducer", () => {
    it("has a default state", () => {
        expect(usersReducer(undefined, { type: "unexpected" })).toEqual({
            list: []
        });
    });

    it("has a onListFetched", () => {
        expect(
            usersReducer(
                {
                    list: []
                },
                {
                    type: "USERS_LIST_FETCHED",
                    ids: [0, 1, 2]
                }
            )
        ).toEqual({
            list: [0, 1, 2]
        });
    });
});
