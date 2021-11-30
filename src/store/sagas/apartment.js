import { put, call, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { requestPending, requestSuccess, requestFailed } from "utils/request";
import apiCall from "utils/apiCall";
import {
  GET_APARTMENTS,
  ADD_APARTMENT,
  UPDATE_APARTMENT,
  DELETE_APARTMENT,
  GET_TOTAL_APARTMENTS,
} from "store/constants";

export function* addApartmentSaga(action) {
  try {
    yield put({ type: requestPending(ADD_APARTMENT) });
    yield call(apiCall, "/apartments", "POST", action.payload, true);
    yield put({ type: requestSuccess(ADD_APARTMENT) });
    yield put(push("/apartments"));
  } catch (error) {
    yield put({ type: requestFailed(ADD_APARTMENT), payload: error.response });
  }
}

export function* updateApartmentSaga(action) {
  try {
    yield put({ type: requestPending(UPDATE_APARTMENT) });
    yield call(
      apiCall,
      `/apartments/${action.payload._id}`,
      "PUT",
      action.payload,
      true
    );
    yield put({ type: requestSuccess(UPDATE_APARTMENT) });
    yield put(push("/apartments"));
  } catch (error) {
    yield put({
      type: requestFailed(UPDATE_APARTMENT),
      payload: error.response,
    });
  }
}

export function* deleteApartmentSaga(action) {
  try {
    const state = yield select();
    const {
      priceValue,
      floorSizeValue,
      roomsValue,
    } = state.apartment.apartmentsFilter;

    yield put({ type: requestPending(DELETE_APARTMENT) });
    yield call(
      apiCall,
      `/apartments/${action.payload.id}`,
      "DELETE",
      null,
      true
    );
    yield put({ type: requestSuccess(DELETE_APARTMENT) });

    const response = yield call(apiCall, "/apartments/", "GET", null, true, {
      order: "desc",
      orderBy: "created",
      rowsCount: 5,
      currentPage: 0,
      priceMin: priceValue[0],
      priceMax: priceValue[1],
      floorSizeMin: floorSizeValue[0],
      floorSizeMax: floorSizeValue[1],
      roomsMin: roomsValue[0],
      roomsMax: roomsValue[1],
    });

    yield put({
      type: requestSuccess(GET_APARTMENTS),
      payload: response.data,
    });

    yield put(push("/apartments"));
  } catch (error) {
    yield put({
      type: requestFailed(DELETE_APARTMENT),
      payload: error.response,
    });
  }
}

export function* getApartmentsSaga(action) {
  try {
    const state = yield select();
    const {
      priceValue,
      floorSizeValue,
      roomsValue,
    } = state.apartment.apartmentsFilter;

    yield put({ type: requestPending(GET_APARTMENTS) });

    const {
      order,
      orderBy,
      rowsPerPage,
      page,
      rentable = "all",
    } = action.payload;
    const response = yield call(apiCall, "/apartments/", "GET", null, true, {
      order,
      orderBy,
      rowsCount: rowsPerPage,
      currentPage: page,
      priceMin: priceValue[0],
      priceMax: priceValue[1],
      floorSizeMin: floorSizeValue[0],
      floorSizeMax: floorSizeValue[1],
      roomsMin: roomsValue[0],
      roomsMax: roomsValue[1],
      rentable,
    });

    yield put({
      type: requestSuccess(GET_APARTMENTS),
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: requestFailed(GET_APARTMENTS), payload: error.response });
  }
}

export function* getTotalApartmentsSaga(action) {
  try {
    const state = yield select();
    const {
      priceValue,
      floorSizeValue,
      roomsValue,
    } = state.apartment.apartmentsFilter;

    yield put({ type: requestPending(GET_TOTAL_APARTMENTS) });

    const response = yield call(
      apiCall,
      "/apartments/total",
      "GET",
      null,
      true,
      {
        priceMin: priceValue[0],
        priceMax: priceValue[1],
        floorSizeMin: floorSizeValue[0],
        floorSizeMax: floorSizeValue[1],
        roomsMin: roomsValue[0],
        roomsMax: roomsValue[1],
      }
    );

    yield put({
      type: requestSuccess(GET_TOTAL_APARTMENTS),
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: requestFailed(GET_TOTAL_APARTMENTS),
      payload: error.response,
    });
  }
}
