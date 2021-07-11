import { combineReducers } from "redux";
import authReducer from "./auth_reducers";
import collectionReducer from "./collection_reducer";
import videoReducer from "./video_reducer";
import audioReducer from "./audio_reducer";
import summarizeReducer from "./summarize_reducer";

const rootReducer = combineReducers({
  authReducer,
  collectionReducer,
  videoReducer,
  audioReducer,
  summarizeReducer,
});

export default rootReducer;
