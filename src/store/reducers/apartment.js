import {
  GET_APARTMENTS,
  SET_APARTMENTS_FILTER,
  SAVE_EDIT_APARTMENT,
  GET_TOTAL_APARTMENTS,
} from "store/constants";
import { requestPending, requestSuccess, requestFailed } from "utils/request";

const initialState = {
  loading: false,
  status: "INIT",
  error: null,
  apartmentsInfo: { apartments: [], totalCount: 0 },
  apartmentsFilter: {
    priceValue: [1, 10000],
    floorSizeValue: [1, 10000],
    roomsValue: [1, 100],
  },
  apartment: null,
  totalApartments: { apartments: [], totalCount: 0 },
};

export const apartmentReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_APARTMENTS_FILTER: {
      return {
        ...state,
        apartmentsFilter: action.payload,
      };
    }
    case SAVE_EDIT_APARTMENT: {
      return {
        ...state,
        apartment: action.payload,
      };
    }
    case requestPending(GET_APARTMENTS): {
      return {
        ...state,
        status: requestPending(GET_APARTMENTS),
        loading: true,
      };
    }
    case requestSuccess(GET_APARTMENTS): {
      return {
        ...state,
        status: requestSuccess(GET_APARTMENTS),
        loading: false,
        apartmentsInfo: action.payload,
      };
    }
    case requestFailed(GET_APARTMENTS): {
      return {
        ...state,
        status: requestFailed(GET_APARTMENTS),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(GET_TOTAL_APARTMENTS): {
      return {
        ...state,
        status: requestPending(GET_TOTAL_APARTMENTS),
        loading: true,
      };
    }
    case requestSuccess(GET_TOTAL_APARTMENTS): {
      return {
        ...state,
        status: requestSuccess(GET_TOTAL_APARTMENTS),
        loading: false,
        totalApartments: action.payload,
      };
    }
    case requestFailed(GET_TOTAL_APARTMENTS): {
      return {
        ...state,
        status: requestFailed(GET_TOTAL_APARTMENTS),
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
