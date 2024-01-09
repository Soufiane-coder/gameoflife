import { createSelector } from "reselect";

const selectCategories = (state) => state.categories;

export const selectCurrentCategories = createSelector(
  [selectCategories],
  (categories) => categories.categories // todo to discover how to make one object without sub-object with same name
);

// export const selectMessage = createSelector(
//   [selectRoutines],
//   (routines) => (routineId) => routines.routines.find(routine => routine.routineId === routineId).message
// )

// export const selectFilteredOption = createSelector(
//   [selectRoutines],
//   (routines) => (filterLabel) => {
//     switch (filterLabel) {
//       case 'all':
//         return routines.routines;
//       case 'important':
//         return routines.routines.filter(routine => routine.priority === 'important');
//       case 'completed':
//         return routines.routines.filter(routine => routine.isSubmitted === true);
//       case 'waiting':
//         return routines.routines.filter(routine => routine.isSubmitted === false);
//       default:
//         return routines.routines;
//     }
//   }
// )