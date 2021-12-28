import Actions from "../../modules/user/user-actions";

describe("should do all actions with component user", () => {
    it("should update user", () => {
        const reqData = {
            username: "prachenskyka",
            firstname: "Karel",
            lastname: "Prachensky",
            email: "karel@email.com",
            email_verified: false,
            attributes: {}
        };
        const expectedAction = {
            type: "USER_PAGE_UPDATE",
            data: {
                username: "prachenskyka",
                firstname: "Karel",
                lastname: "Prachensky",
                email: "karel@email.com",
                email_verified: false,
                attributes: {}
            }
        };
        expect(Actions.Creators.update(reqData)).toEqual(expectedAction);
    });
});
