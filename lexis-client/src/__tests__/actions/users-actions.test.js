import Actions from "../../modules/users/users-actions";

describe("should do all users actions", () => {
    it("should fetch list of user ids", () => {
        const reqData = [0, 1, 2];
        const expectedAction = {
            type: "USERS_LIST_FETCHED",
            ids: [0, 1, 2]
        };
        expect(Actions.Creators.listFetched(reqData)).toEqual(expectedAction);
    });

    it("should create new user", () => {
        const reqData = {
            firstname: "Whitaker",
            lastname: "Sandoval"
        };

        const expectedAction = {
            type: "USERS_CREATE",
            data: {
                firstname: "Whitaker",
                lastname: "Sandoval"
            }
        };
        expect(Actions.Creators.create(reqData)).toEqual(expectedAction);
    });

    it("should update user", () => {
        const reqData = {
            firstname: "Whitaker",
            lastname: "Sandoval"
        };
        const expectedAction = {
            type: "USERS_UPDATE",
            data: {
                firstname: "Whitaker",
                lastname: "Sandoval"
            }
        };
        expect(Actions.Creators.update(reqData)).toEqual(expectedAction);
    });
    it("should remove user", () => {
        const reqData = 49;
        const expectedAction = {
            type: "USERS_REMOVE",
            id: 49
        };
        expect(Actions.Creators.remove(reqData)).toEqual(expectedAction);
    });
});
