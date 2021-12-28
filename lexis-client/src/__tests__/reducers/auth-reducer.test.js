import { authReducer } from "../../modules/auth/auth-reducer";

describe("Should request auth reducer", () => {
    it("has a default state", () => {
        expect(authReducer(undefined, { type: "unexpected" })).toEqual({
            user: null
        });
    });

    it("has a onUserProfileFetched", () => {
        expect(
            authReducer(
                {
                    user: null
                },
                {
                    type: "AUTH_USER_PROFILE_FETCHED",
                    userProfile: {
                        username: "prachenskyka",
                        firstname: "Karel",
                        lastname: "Prachensky",
                        email: "karel@email.com",
                        email_verified: false,
                        attributes: {}
                    }
                }
            )
        ).toEqual({
            user: {
                username: "prachenskyka",
                firstname: "Karel",
                lastname: "Prachensky",
                email: "karel@email.com",
                email_verified: false,
                attributes: {}
            }
        });
    });
});
