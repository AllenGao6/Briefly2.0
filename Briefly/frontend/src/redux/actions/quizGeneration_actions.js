import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

const SUMMARIZE_BASE_URL = BASE_URL + "api/collection/";

export const generateQuiz =
  (collectionId, mediaId, mediaType, quizConfig) => async (dispatch) => {
    const response = await axios.post(
      `${SUMMARIZE_BASE_URL}${collectionId}/${mediaType}/${mediaId}/quiz/`,
      quizConfig,
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }
    );
    if (response.status === 200) {
      console.log(response);
      dispatch({
        type: type.QuizGen_SUCCESS,
        mediaType: mediaType,
        quiz: response.data,
        mediaId: mediaId,
      });
      return true;
    } else {
      console.log(response);
      dispatch({
        type: type.QuizGen_FAILURE,
      });
      return false;
    }
  };

  export const resetAudioQuiz = (id, audioId) => (dispatch) => {
    return axios
      .get(`${SUMMARIZE_BASE_URL}${id}/audio/${audioId}/resetQuiz/`)
      .then((res) => {
        dispatch({
          type: type.RESET_AUDIO_QUIZ_SUCCESS,
          audioId: audioId,
        });
      })
      .catch((err) => {
        dispatch({
          type: type.RESET_AUDIO_QUIZ_FAILURE,
        });
        console.log(err);
      });
  };

  export const resetVideoQuiz = (id, videoId) => (dispatch) => {
    return axios
      .get(`${SUMMARIZE_BASE_URL}${id}/video/${videoId}/resetQuiz/`)
      .then((res) => {
        dispatch({
          type: type.RESET_VIDEO_QUIZ_SUCCESS,
          videoId: videoId,
        });
      })
      .catch((err) => {
        dispatch({
          type: type.RESET_VIDEO_QUIZ_FAILURE,
        });
        console.log(err);
      });
  };