import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";

const GET_ALL_COLLECTIONS_URL = BASE_URL + "api/collection/";

// load all collections owned by the signed-in user
export const loadCollections = () => (dispatch) => {
  dispatch({
    type: type.LOADING_COLLECTIONS,
  });
  axios
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
