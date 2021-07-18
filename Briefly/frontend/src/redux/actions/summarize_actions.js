import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

const SUMMARIZE_BASE_URL = BASE_URL + "api/collection/";

export const transcribeMedia =
  (collectionId, mediaId, mediaType) => async (dispatch) => {
    console.log(mediaId);
    const response = await axios.get(
      `${SUMMARIZE_BASE_URL}${collectionId}/${mediaType}/${mediaId}/transcribe_begin/`
    );
    if (response.status === 200) {
      dispatch({
        type: type.TRANSCRIBE_SUCCESS,
      });
      return true;
    } else {
      dispatch({
        type: type.TRANSCRIBE_FAILURE,
      });
      return false;
    }
  };

// api/<int: collection_id>/video/<int: video_id>/summary_begin/
export const summarizeMedia =
  (collectionId, mediaId, mediaType, summaryConfig) => async (dispatch) => {
    const response = await axios.post(
      `${SUMMARIZE_BASE_URL}${collectionId}/${mediaType}/${mediaId}/summary_begin/`,
      summaryConfig,
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
        type: type.SUMMARIZE_SUCCESS,
        mediaType: mediaType,
        summary: response.data,
      });
      return response.data;
    } else {
      console.log(response);
      dispatch({
        type: type.SUMMARIZE_FAILURE,
      });
      return false;
    }
  };
