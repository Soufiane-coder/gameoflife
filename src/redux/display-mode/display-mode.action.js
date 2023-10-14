import { DisplayModeActionTypes } from "./display-mode.types";

export const setDisplayModeTo = (displayMode) => ({
  type: DisplayModeActionTypes.SET_DISPLAY_MODE,
  payload: displayMode,
});
