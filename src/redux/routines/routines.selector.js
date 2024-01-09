import { createSelector } from "reselect";

const selectRoutines = (state) => state.routines;

export const selectCurrentRoutines = createSelector(
  [selectRoutines],
  (routines) => routines.routines
);

export const selectMessage = createSelector(
  [selectRoutines],
  (routines) => (routineId) => routines.routines.find(routine => routine.routineId === routineId).message
)
