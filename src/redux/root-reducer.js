import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user.reducer";
import routinesReducer from "./routines/routines.reducer";
import displayModeReducer from './display-mode/display-mode.reducer';
import popupReducer from "./popup/popup.reducer";
import categoriesReducer from "./categories/categories.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["displayMode"],
};

const rootReducer = combineReducers({
  user: userReducer,
  routines: routinesReducer,
  displayMode: displayModeReducer,
  popup: popupReducer,
  categories: categoriesReducer, // todo verfy in here so there is no sub-object
});

export default persistReducer(persistConfig, rootReducer);
