import { createSelector } from "reselect";

const selectDisplayMode = (state) => state.displayMode;

export const selectCurrentDisplayMode = createSelector(
  [selectDisplayMode],
  (displayMode) => displayMode.displayMode
);
