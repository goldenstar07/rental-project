import axios from "axios";

const apiCall = (
  url,
  method,
  body = null,
  includeToken = true,
  params = {}
) => {
  const token = window.localStorage.getItem("rental_auth_token");
  let headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };

  if (includeToken) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
  return axios.request({
    headers,
    url,
    method,
    data: body,
    params,
  });
};

export default apiCall;
