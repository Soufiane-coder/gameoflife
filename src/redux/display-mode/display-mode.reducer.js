import { DisplayModeActionTypes } from "./display-mode.types";

const INITIAL_STATE = {
  displayMode: 'light',
};

const displayModeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DisplayModeActionTypes.SET_DISPLAY_MODE:
      return {
        ...state,
        displayMode: action.payload
      };
    default:
      return state;
  }
};

export default displayModeReducer;
