import axios from "axios";
import * as type from "./action_types";
import { BASE_URL, csrftoken } from "../constant";

const COLLECTIONS_BASE_URL = BASE_URL + "api/collection/";

export const loadVideosInCollection = (id) => (dispatch) => {
  dispatch({ type: type.LOADING_VIDEOS });
  return axios
    .get(`${COLLECTIONS_BASE_URL}${id}/video/`)
    .then((res) => {
      dispatch({
        type: type.LOAD_VIDEOS_SUCCESS,
        videos: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.LOAD_VIDEOS_FAILURE,
      });
    });
};

export const createVideoInCollection = (id, video) => (dispatch) => {
  dispatch({ type: type.CREATING_VIDEO });
  return axios
    .post(`${COLLECTIONS_BASE_URL}${id}/video/`, JSON.stringify(video), {
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    })
    .then((res) => {
      dispatch({
        type: type.CREATE_VIDEO_SUCCESS,
        video: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.CREATE_VIDEO_FAILURE,
      });
    });
};

export const updateVideoInCollection = (id, video, videoId) => (dispatch) => {
  dispatch({ type: type.CREATING_VIDEO });
  return axios
    .patch(
      `${COLLECTIONS_BASE_URL}${id}/video/${videoId}/`,
      JSON.stringify(video),
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      }
    )
    .then((res) => {
      dispatch({
        type: type.UPDATE_VIDEO_SUCCESS,
        video: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.UPDATE_VIDEO_FAILURE,
      });
      console.log(err);
    });
};

export const deleteVideos = (id, list_id) => (dispatch) => {
  dispatch({ type: type.DELETING_VIDEOS });
  return axios
    .post(
      `${COLLECTIONS_BASE_URL}${id}/video/delete_list_videos/`,
      { list_id: list_id },
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      }
    )
    .then((res) => {
      dispatch({
        type: type.DELETE_VIDEO_SUCCESS,
        data: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.DELETE_VIDEO_FAILURE,
      });
      console.log(err);
    });
};
