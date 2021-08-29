import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

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

export const createVideoInCollection = (id, video) => async (dispatch) => {
  dispatch({ type: type.CREATING_VIDEO });
  console.log("Post");
  const response = await axios.post(
    `${COLLECTIONS_BASE_URL}${id}/video/`,
    video,
    {
      headers: {
        "content-type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    }
  );
  alert(response.status);
  if (response.status === 201) {
    dispatch({
      type: type.CREATE_VIDEO_SUCCESS,
      video: response.data,
    });
    return response.data;
  } else {
    alert("failed!");
    dispatch({
      type: type.CREATE_VIDEO_FAILURE,
    });
    return null;
  }
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
          "X-CSRFToken": Cookies.get("csrftoken"),
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
          "X-CSRFToken": Cookies.get("csrftoken"),
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

export const resetVideoSummarization = (id, videoId) => (dispatch) => {
  return axios
    .get(`${COLLECTIONS_BASE_URL}${id}/video/${videoId}/reset/`)
    .then((res) => {
      dispatch({
        type: type.RESET_VIDEO_SUMMARY_SUCCESS,
        videoId: videoId,
      });
    })
    .catch((err) => {
      dispatch({
        type: type.RESET_VIDEO_SUMMARY_FAILURE,
      });
      console.log(err);
    });
};
