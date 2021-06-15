import * as type from "../actions/action_types";

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case type.LOGIN_SUCCESS:
      localStorage.setItem("accessToken", action.data.accessToken);
      return {
        ...state,
        user: action.data,
        accessToken: action.data.token,
      };
    case type.LOGOUT_SUCCESS:
      localStorage.removeItem("accessToken");
      return {
        ...state,
        user: null,
      };
    case type.LOGIN_FAILURE:
      console.log(action.error);
    default:
      return state;
  }
}
