import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";

const SUMMARIZE_BASE_URL = BASE_URL + "api/collection/";

export const transcribeMedia =
  (collectionId, mediaId, mediaType) => async (dispatch) => {
    console.log(mediaId);
    const response = await axios.get(
      `${SUMMARIZE_BASE_URL}${collectionId}/${mediaType}/${mediaId}/summary_begin/`
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
