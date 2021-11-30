import {
  GET_REALTORS,
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  SAVE_EDIT_USER,
} from "store/constants";
import { requestPending, requestSuccess, requestFailed } from "utils/request";

const initialState = {
  loading: false,
  status: "INIT",
  error: null,
  realtorsInfo: null,
  usersInfo: { users: [], totalCount: 0 },
};

export const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case SAVE_EDIT_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case requestPending(GET_REALTORS): {
      return {
        ...state,
        status: requestPending(GET_REALTORS),
        loading: true,
      };
    }
    case requestSuccess(GET_REALTORS): {
      return {
        ...state,
        status: requestSuccess(GET_REALTORS),
        loading: false,
        realtorsInfo: action.payload,
      };
    }
    case requestFailed(GET_REALTORS): {
      return {
        ...state,
        status: requestFailed(GET_REALTORS),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(GET_USERS): {
      return {
        ...state,
        status: requestPending(GET_USERS),
        loading: true,
      };
    }
    case requestSuccess(GET_USERS): {
      return {
        ...state,
        status: requestSuccess(GET_USERS),
        loading: false,
        usersInfo: action.payload,
      };
    }
    case requestFailed(GET_USERS): {
      return {
        ...state,
        status: requestFailed(GET_USERS),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(ADD_USER): {
      return {
        ...state,
        status: requestPending(ADD_USER),
        loading: true,
      };
    }
    case requestSuccess(ADD_USER): {
      return {
        ...state,
        status: requestSuccess(ADD_USER),
        loading: false,
      };
    }
    case requestFailed(ADD_USER): {
      return {
        ...state,
        status: requestFailed(ADD_USER),
        loading: false,
        error: action.payload,
      };
    }
    case requestPending(UPDATE_USER): {
      return {
        ...state,
        status: requestPending(UPDATE_USER),
        loading: true,
      };
    }
    case requestSuccess(UPDATE_USER): {
      return {
        ...state,
        status: requestSuccess(UPDATE_USER),
        loading: false,
      };
    }
    case requestFailed(UPDATE_USER): {
      return {
        ...state,
        status: requestFailed(UPDATE_USER),
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
