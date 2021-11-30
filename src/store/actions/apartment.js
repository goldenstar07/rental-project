import {
  ADD_APARTMENT,
  GET_APARTMENTS,
  UPDATE_APARTMENT,
  DELETE_APARTMENT,
  SET_APARTMENTS_FILTER,
  SAVE_EDIT_APARTMENT,
  GET_TOTAL_APARTMENTS,
} from "store/constants";

export const addApartment = payload => {
  return { type: ADD_APARTMENT, payload };
};

export const getApartments = payload => {
  return { type: GET_APARTMENTS, payload };
};

export const updateApartment = payload => {
  return { type: UPDATE_APARTMENT, payload };
};

export const deleteApartment = payload => {
  return { type: DELETE_APARTMENT, payload };
};

export const setApartmentsFilter = payload => {
  return { type: SET_APARTMENTS_FILTER, payload };
};

export const saveEditApartment = payload => {
  return { type: SAVE_EDIT_APARTMENT, payload };
};

export const getTotalApartments = () => {
  return { type: GET_TOTAL_APARTMENTS };
};
