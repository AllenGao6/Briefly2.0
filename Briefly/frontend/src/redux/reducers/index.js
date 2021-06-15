import { combineReducers } from "redux";
import authReducer from "./auth_reducers";

const rootReducer = combineReducers({
  authReducer,
});

export default rootReducer;
