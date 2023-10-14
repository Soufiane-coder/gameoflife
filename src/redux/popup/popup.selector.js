import { createSelector } from "reselect";

const selectPopup = (state) => state.popup;

export const selectCurrentPopup = createSelector(
  [selectPopup],
  (popup) => popup.popup
);
