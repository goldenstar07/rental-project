import { put, call } from "redux-saga/effects";
import { push } from "connected-react-router";
import { requestPending, requestSuccess, requestFailed } from "utils/request";
import apiCall from "utils/apiCall";
import {
  GET_REALTORS,
  ADD_USER,
  GET_USERS,
  UPDATE_USER,
  DELETE_USER,
} from "store/constants";

export function* getRealtorsSaga(action) {
  try {
    yield put({ type: requestPending(GET_REALTORS) });

    const response = yield call(apiCall, "/users/realtors/", "GET", null, true);

    yield put({
      type: requestSuccess(GET_REALTORS),
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: requestFailed(GET_REALTORS), payload: error.response });
  }
}

export function* getUsersSaga(action) {
  try {
    yield put({ type: requestPending(GET_USERS) });

    const { order, orderBy, rowsPerPage, page } = action.payload;
    const response = yield call(apiCall, "/users/", "GET", null, true, {
      order,
      orderBy,
      rowsCount: rowsPerPage,
      currentPage: page,
    });

    yield put({
      type: requestSuccess(GET_USERS),
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: requestFailed(GET_USERS), payload: error.response });
  }
}

export function* addUserSaga(action) {
  try {
    yield put({ type: requestPending(ADD_USER) });
    yield call(apiCall, "/users", "POST", action.payload, true);
    yield put({ type: requestSuccess(ADD_USER) });
    yield put(push("/users"));
  } catch (error) {
    yield put({ type: requestFailed(ADD_USER), payload: error.response });
  }
}

export function* updateUserSaga(action) {
  try {
    yield put({ type: requestPending(UPDATE_USER) });
    yield call(
      apiCall,
      `/users/${action.payload._id}`,
      "PUT",
      action.payload,
      true
    );
    yield put({ type: requestSuccess(UPDATE_USER) });
    yield put(push("/users"));
  } catch (error) {
    yield put({
      type: requestFailed(UPDATE_USER),
      payload: error.response,
    });
  }
}

export function* deleteUserSaga(action) {
  try {
    yield put({ type: requestPending(DELETE_USER) });
    yield call(apiCall, `/users/${action.payload.id}`, "DELETE", null, true);
    yield put({ type: requestSuccess(DELETE_USER) });

    const response = yield call(apiCall, "/users/", "GET", null, true, {
      order: "desc",
      orderBy: "created",
      rowsCount: 5,
      currentPage: 0,
    });

    yield put({
      type: requestSuccess(GET_USERS),
      payload: response.data,
    });

    yield put(push("/users"));
  } catch (error) {
    yield put({
      type: requestFailed(DELETE_USER),
      payload: error.response,
    });
  }
}
