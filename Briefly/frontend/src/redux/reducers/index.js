import { combineReducers } from "redux";
import authReducer from "./auth_reducers";
import collectionReducer from "./collectionReducer";

const rootReducer = combineReducers({
  authReducer,
  collectionReducer,
});

export default rootReducer;
