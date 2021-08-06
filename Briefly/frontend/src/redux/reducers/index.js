import { combineReducers } from "redux";
import authReducer from "./auth_reducers";
import collectionReducer from "./collection_reducer";
import videoReducer from "./video_reducer";
import audioReducer from "./audio_reducer";
import textReducer from "./text_reducer";
import summarizeReducer from "./summarize_reducer";
import playerReducer from "./player_reducer";

const rootReducer = combineReducers({
  authReducer,
  collectionReducer,
  videoReducer,
  audioReducer,
  textReducer,
  summarizeReducer,
  playerReducer,
});

export default rootReducer;
