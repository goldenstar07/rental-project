import { all, takeEvery } from "redux-saga/effects";
import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  ADD_APARTMENT,
  UPDATE_APARTMENT,
  DELETE_APARTMENT,
  GET_APARTMENTS,
  GET_REALTORS,
  GET_TOTAL_APARTMENTS,
  ADD_USER,
  GET_USERS,
  UPDATE_USER,
  DELETE_USER,
  UPDATE_ME,
} from "store/constants";

import { signupSaga, loginSaga, logoutSaga, updateMeSaga } from "./auth";
import {
  addApartmentSaga,
  getApartmentsSaga,
  updateApartmentSaga,
  deleteApartmentSaga,
  getTotalApartmentsSaga,
} from "./apartment";
import {
  getRealtorsSaga,
  addUserSaga,
  updateUserSaga,
  deleteUserSaga,
  getUsersSaga,
} from "./users";

export default function* rootSaga() {
  yield all([
    takeEvery(SIGNUP, signupSaga),
    takeEvery(LOGIN, loginSaga),
    takeEvery(GET_REALTORS, getRealtorsSaga),
    takeEvery(ADD_APARTMENT, addApartmentSaga),
    takeEvery(UPDATE_APARTMENT, updateApartmentSaga),
    takeEvery(DELETE_APARTMENT, deleteApartmentSaga),
    takeEvery(GET_APARTMENTS, getApartmentsSaga),
    takeEvery(GET_TOTAL_APARTMENTS, getTotalApartmentsSaga),
    takeEvery(ADD_USER, addUserSaga),
    takeEvery(UPDATE_USER, updateUserSaga),
    takeEvery(DELETE_USER, deleteUserSaga),
    takeEvery(GET_USERS, getUsersSaga),
    takeEvery(UPDATE_ME, updateMeSaga),
    takeEvery(LOGOUT, logoutSaga),
  ]);
}
