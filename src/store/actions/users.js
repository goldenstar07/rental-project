import {
  GET_REALTORS,
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  SAVE_EDIT_USER,
} from "store/constants";

export const getRealtors = () => {
  return { type: GET_REALTORS };
};

export const getUsers = payload => {
  return { type: GET_USERS, payload };
};

export const addUser = payload => {
  return { type: ADD_USER, payload };
};

export const updateUser = payload => {
  return { type: UPDATE_USER, payload };
};

export const deleteUser = payload => {
  return { type: DELETE_USER, payload };
};

export const saveEditUser = payload => {
  return { type: SAVE_EDIT_USER, payload };
};
