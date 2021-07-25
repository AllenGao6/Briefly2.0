import * as type from "./action_types";

export const seekTo = (time) => (dispatch) => {
  dispatch({
    type: type.PLAYER_SEEKING,
    time: time,
  });
};

export const seeked = () => (dispatch) => {
  dispatch({
    type: type.PLAYER_SEEKING,
    time: null,
  });
};
