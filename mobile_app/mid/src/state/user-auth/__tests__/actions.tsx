import { setMockStore } from "../../../utils/test_utils";
import { initialState } from "../reducers";
import { loginStart, loginUser } from "../actions";

describe("when a user logs in", () => {
  let store;

  beforeEach(() => {
    [store, component] = setMockStore({ userAuth: initialState });
  });

  // TODO: Async action creator tests with correctly setup firebase mock
  // it("fires a login start action", () => {
  //   store.dispatch(loginUser("test@example.com", "password"));
  //   expect(store.getActions()).toContainEqual(loginStart());
  // });
  it("fires a login finished action", () => {});
  it("fires a login error action", () => {});
  it("login action creator", () => {});
});
