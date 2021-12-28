import Actions from "../../modules/api/api-actions";

describe("should do all api actions", () => {
    it("should get internal server error", () => {
        const reqData = "";
        const expectedAction = {
            type: "API_INTERNAL_SERVER_ERROR",
            message: ""
        };
        expect(Actions.Creators.internalServerError(reqData)).toEqual(
            expectedAction
        );
    });
});
