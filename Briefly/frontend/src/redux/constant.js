import Cookies from "js-cookie";

export const BASE_URL = "http://localhost:8000/";
export const csrftoken = Cookies.get("csrftoken");
