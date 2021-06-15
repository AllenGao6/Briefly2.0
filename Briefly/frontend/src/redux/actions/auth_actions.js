import axios from "axios";
import * as type from "./action_types";
import { BASE_URL } from "../constant";

const LOGIN_URL = BASE_URL + "auth/google-oauth2/";
const LOGOUT_URL = BASE_URL + "logout/";

export const login = (response, callback) => (dispatch) => {
  return axios
    .get(LOGIN_URL)
    .then((result) => {
      dispatch({
        type: type.LOGIN_SUCCESS,
        data: result.data,
      });
      callback();
    })
    .catch((error) => {
      console.log(error);
      axios
        .post(LOGIN_URL, {
          access_token: response.accessToken,
        })
        .then(function (result) {
          dispatch({
            type: type.LOGIN_SUCCESS,
            data: result.data,
          });
          callback();
        })
        .catch(function (error) {
          dispatch({
            type: type.LOGIN_FAILURE,
            error: error,
          });
        });
    });
};

export const logout = () => (dispatch) => {
  return axios.get(LOGOUT_URL).then((res) => {
    dispatch({
      type: type.LOGOUT_SUCCESS,
    });
  });
};
