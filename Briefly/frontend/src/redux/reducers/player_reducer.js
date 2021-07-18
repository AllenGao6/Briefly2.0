import * as type from "../actions/action_types";

const initialState = {
  seekTime: null,
};

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case type.PLAYER_SEEKING:
      return { ...state, seekTime: action.time };
    default:
      return state;
  }
}
