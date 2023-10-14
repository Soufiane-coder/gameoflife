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

export const selectFilteredOption = createSelector(
  [selectRoutines],
  (routines) => (filterLabel) => {
    switch (filterLabel) {
      case 'all':
        return routines.routines;
      case 'important':
        return routines.routines.filter(routine => routine.priority === 'important');
      case 'completed':
        return routines.routines.filter(routine => routine.submitted === "1");
      case 'waiting':
        return routines.routines.filter(routine => routine.submitted === "0");
      default:
        return routines.routines;
    }
  }
)