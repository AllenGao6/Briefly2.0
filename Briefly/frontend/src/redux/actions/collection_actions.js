import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";
import Cookies from "js-cookie";

const GET_ALL_COLLECTIONS_URL = BASE_URL + "api/collection/";
const CREATE_COLLECTION_URL = BASE_URL + "api/collection/";

const progressUpdate =
  (dispatch) =>
  ({ loaded, total }) => {
    let percent = Math.floor((loaded * 100) / total);
    console.log(`${loaded}KB of ${total} KB | ${percent}%`);
    if (percent < 100) {
      dispatch({
        type: type.UPDATE_PERCENTAGE,
        percentage: percent,
      });
    }
  };

// load all collections owned by the signed-in user
export const loadCollections = () => (dispatch) => {
  dispatch({
    type: type.LOADING_COLLECTIONS,
  });
  return axios
    .get(GET_ALL_COLLECTIONS_URL)
    .then((res) => {
      dispatch({
        type: type.LOAD_COLLECTIONS_SUCCESS,
        collections: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: type.LOAD_COLLECTIONS_FAILURE,
      });
    });
};

export const createCollection = (formData, callback) => (dispatch) => {
  const csrftoken = Cookies.get("csrftoken");
  dispatch({
    type: type.CREATING_COLLECTION,
  });
  return axios
    .post(CREATE_COLLECTION_URL, formData, {
      headers: {
        "content-type": "multipart/form-data",
        "X-CSRFToken": csrftoken,
      },
    })
    .then((res) => {
      dispatch({
        type: type.CREATE_COLLECTION_SUCCESS,
        collection: res.data,
      });
      callback();
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: type.CREATE_COLLECTION_FAILURE,
      });
    });
};
