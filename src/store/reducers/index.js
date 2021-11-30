import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./auth";
import { apartmentReducer } from "./apartment";
import { userReducer } from "./user";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  blacklist: ["loading", "status", "error"],
};

const apartmentPersistConfig = {
  key: "apartment",
  storage: storage,
  blacklist: [
    "loading",
    "status",
    "error",
    "apartmentsInfo",
    "apartmentsFilter",
  ],
};

const userPersistConfig = {
  key: "user",
  storage: storage,
  blacklist: ["loading", "status", "error", "realtorsInfo"],
};

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    auth: persistReducer(authPersistConfig, authReducer),
    apartment: persistReducer(apartmentPersistConfig, apartmentReducer),
    user: persistReducer(userPersistConfig, userReducer),
  });

export default createRootReducer;
