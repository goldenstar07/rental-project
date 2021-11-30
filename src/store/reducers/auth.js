import {
  SIGNUP,
  LOGIN,
  REMOVE_AUTH,
  UPDATE_ME,
  CLEAR_AUTH_STATUS,
} from "store/constants";
import { requestPending, requestSuccess, requestFailed } from "utils/request";

const initialState = {
  me: null,
  loading: false,
  status: "INIT",
  error: null,
};

export const authReducer = function (state = initialState, action) {
  switch (action.type) {
    case requestPending(SIGNUP): {
      return {
        ...state,
        status: requestPending(SIGNUP),
        loading: true,
      };
    }
    case requestSuccess(SIGNUP): {
      return {
        ...state,
        status: requestSuccess(SIGNUP),
        loading: false,
      };
    }
    case requestFailed(SIGNUP): {
      return {
        ...state,
        status: requestFailed(SIGNUP),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(LOGIN): {
      return {
        ...state,
        status: requestPending(LOGIN),
        loading: true,
      };
    }
    case requestSuccess(LOGIN): {
      return {
        ...state,
        me: action.payload,
        status: requestSuccess(LOGIN),
        loading: false,
      };
    }
    case requestFailed(LOGIN): {
      return {
        ...state,
        status: requestFailed(LOGIN),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(UPDATE_ME): {
      return {
        ...state,
        status: requestPending(UPDATE_ME),
        loading: true,
      };
    }
    case requestSuccess(UPDATE_ME): {
      return {
        ...state,
        status: requestSuccess(UPDATE_ME),
        me: action.payload,
        loading: false,
        error: null,
      };
    }
    case requestFailed(UPDATE_ME): {
      return {
        ...state,
        status: requestFailed(UPDATE_ME),
        loading: false,
        error: action.payload,
      };
    }
    case CLEAR_AUTH_STATUS: {
      return {
        ...state,
        status: "INIT",
        error: null,
      };
    }
    case REMOVE_AUTH: {
      return {
        me: null,
        loading: false,
        status: "INIT",
        error: null,
      };
    }
    default:
      return state;
  }
};
