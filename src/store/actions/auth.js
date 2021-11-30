import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  UPDATE_ME,
  CLEAR_AUTH_STATUS,
} from "store/constants";

export const signup = payload => {
  return { type: SIGNUP, payload };
};

export const login = payload => {
  return { type: LOGIN, payload };
};

export const logout = () => {
  return { type: LOGOUT };
};

export const updateMe = payload => {
  return { type: UPDATE_ME, payload };
};

export const clearAuthStatus = () => {
  return { type: CLEAR_AUTH_STATUS };
};
