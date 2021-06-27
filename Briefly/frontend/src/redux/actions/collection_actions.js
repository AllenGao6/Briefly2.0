import axios from "axios";
import * as type from "./action_types";
import { BASE_URL, csrftoken } from "../constant";

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

// create a new collection by signed-in user
export const createCollection = (formData) => (dispatch) => {
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
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: type.CREATE_COLLECTION_FAILURE,
      });
    });
};

//let signed in user update an existing collection
export const updateCollection = (formData, id) => (dispatch) => {
  dispatch({
    type: type.CREATING_COLLECTION,
  });
  console.log("id: " + id);
  return axios
    .patch(`${CREATE_COLLECTION_URL}${id}/`, formData, {
      headers: {
        "content-type": "multipart/form-data",
        "X-CSRFToken": csrftoken,
      },
    })
    .then((res) => {
      dispatch({
        type: type.UPDATE_COLLECTION_SUCCESS,
        collection: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: type.UPDATE_COLLECTION_FAILURE,
      });
    });
};

//let signed-in user delete an existing collection group
export const deleteCollection = (id) => (dispatch) => {
  dispatch({
    type: type.DELETING_COLLECTION,
  });

  return axios
    .delete(`${CREATE_COLLECTION_URL}${id}/`, {
      headers: {
        "content-type": "multipart/form-data",
        "X-CSRFToken": csrftoken,
      },
    })
    .then((res) => {
      dispatch({
        type: type.DELETE_COLLECTION_SUCCESS,
        collection: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: type.DELETE_COLLECTION_FAILURE,
      });
    });
};
