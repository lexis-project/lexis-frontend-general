import Actions from "../../modules/auth/auth-actions";

describe("should do all auth actions", () => {
    it("should fetch user profile", () => {
        const reqData = {
            username: "prachenskyka",
            firstname: "Karel",
            lastname: "Prachensky",
            email: "karel@email.com",
            email_verified: false,
            attributes: {}
        };
        const expectedAction = {
            type: "AUTH_USER_PROFILE_FETCHED",
            userProfile: {
                username: "prachenskyka",
                firstname: "Karel",
                lastname: "Prachensky",
                email: "karel@email.com",
                email_verified: false,
                attributes: {}
            }
        };
        expect(Actions.Creators.userProfileFetched(reqData)).toEqual(
            expectedAction
        );
    });
    it("should logout user", () => {
        const expectedAction = {
            type: "AUTH_LOGOUT"
        };

        expect(Actions.Creators.logout()).toEqual(expectedAction);
    });
});
