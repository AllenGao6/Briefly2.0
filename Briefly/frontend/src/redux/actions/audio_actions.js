import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

const COLLECTIONS_BASE_URL = BASE_URL + "api/collection/";

export const loadAudiosInCollection = (id) => (dispatch) => {
  dispatch({ type: type.LOADING_AUDIOS });
  return axios
    .get(`${COLLECTIONS_BASE_URL}${id}/audio/`)
    .then((res) => {
      dispatch({
        type: type.LOAD_AUDIOS_SUCCESS,
        audios: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.LOAD_AUDIOS_FAILURE,
      });
    });
};

export const createAudioInCollection = (id, audio) => async (dispatch) => {
  dispatch({ type: type.CREATING_AUDIO });
  const response = axios.post(`${COLLECTIONS_BASE_URL}${id}/audio/`, audio, {
    headers: {
      "content-type": "multipart/form-data",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  if (response.status === 201) {
    dispatch({
      type: type.CREATE_AUDIO_SUCCESS,
      audio: response.data,
    });
    return response.data;
  } else {
    dispatch({
      type: type.CREATE_AUDIO_FAILURE,
    });
    return null;
  }
};

export const updateAudioInCollection = (id, audio, audioId) => (dispatch) => {
  dispatch({ type: type.CREATING_AUDIO });
  return axios
    .patch(
      `${COLLECTIONS_BASE_URL}${id}/audio/${audioId}/`,
      JSON.stringify(audio),
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }
    )
    .then((res) => {
      dispatch({
        type: type.UPDATE_AUDIO_SUCCESS,
        audio: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.UPDATE_AUDIO_FAILURE,
      });
      console.log(err);
    });
};

export const deleteAudios = (id, list_id) => (dispatch) => {
  dispatch({ type: type.DELETING_AUDIOS });
  return axios
    .post(
      `${COLLECTIONS_BASE_URL}${id}/audio/delete_list_audios/`,
      { list_id: list_id },
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }
    )
    .then((res) => {
      dispatch({
        type: type.DELETE_AUDIO_SUCCESS,
        data: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.DELETE_AUDIO_FAILURE,
      });
      console.log(err);
    });
};
