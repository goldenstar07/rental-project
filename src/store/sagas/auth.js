import { put, call } from "redux-saga/effects";
import { push } from "connected-react-router";
import { requestPending, requestSuccess, requestFailed } from "utils/request";
import apiCall from "utils/apiCall";
import { SIGNUP, LOGIN, REMOVE_AUTH, UPDATE_ME } from "store/constants";

export function* signupSaga(action) {
  try {
    yield put({ type: requestPending(SIGNUP) });
    yield call(apiCall, "/auth/signup/", "POST", { ...action.payload }, false);
    yield put({ type: requestSuccess(SIGNUP) });
    yield put(push("/login"));
  } catch (error) {
    yield put({ type: requestFailed(SIGNUP), payload: error.response });
  }
}

export function* loginSaga(action) {
  try {
    yield put({ type: requestPending(LOGIN) });
    const response = yield call(
      apiCall,
      "/auth/login/",
      "POST",
      { ...action.payload },
      false
    );
    const { token } = response.data;
    window.localStorage.setItem("rental_auth_token", token);
    yield put({ type: requestSuccess(LOGIN), payload: response.data });
    yield put(push("/"));
  } catch (error) {
    yield put({ type: requestFailed(LOGIN), payload: error.response });
  }
}

export function* updateMeSaga(action) {
  try {
    yield put({ type: requestPending(UPDATE_ME) });
    const response = yield call(
      apiCall,
      `/users/${action.payload._id}`,
      "PUT",
      action.payload,
      true
    );
    yield put({ type: requestSuccess(UPDATE_ME), payload: response.data });
  } catch (error) {
    yield put({
      type: requestFailed(UPDATE_ME),
      payload: error.response,
    });
  }
}

export function* logoutSaga(action) {
  try {
    yield put({ type: REMOVE_AUTH });
    window.localStorage.removeItem("rental_auth_token");
    yield put(push("/"));
  } catch (error) {}
}
