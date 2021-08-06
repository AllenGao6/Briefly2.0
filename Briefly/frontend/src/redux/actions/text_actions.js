import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

const COLLECTIONS_BASE_URL = BASE_URL + "api/collection/";

export const createTextInCollection = (id, text) => async (dispatch) => {
    dispatch({ type: type.CREATING_TEXT });
    const response = await axios.post(
      `${COLLECTIONS_BASE_URL}${id}/text/`,
      text,
      {
        headers: {
          "content-type": "multipart/form-data",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }
    );
  
    if (response.status === 201) {
      dispatch({
        type: type.CREATE_TEXT_SUCCESS,
        text: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: type.CREATE_TEXT_FAILURE,
      });
      return null;
    }
  };

  export const loadTextsInCollection = (id) => (dispatch) => {
    dispatch({ type: type.LOADING_TEXTS });
    return axios
      .get(`${COLLECTIONS_BASE_URL}${id}/text/`)
      .then((res) => {
        dispatch({
          type: type.LOAD_TEXTS_SUCCESS,
          texts: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: type.LOAD_TEXTS_FAILURE,
        });
      });
  };