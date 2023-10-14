import { RoutinesActionTypes } from "./routines.types";

export const setCurrentRoutines = (routines) => ({
  type: RoutinesActionTypes.SET_CURRENT_ROUTINES,
  payload: routines,
});

export const setArchivedOption = (routineId, archivedOption) => ({
  type: RoutinesActionTypes.CHANGE_ARCHIVE_OPTION,
  payload: {routineId, archivedOption}
})

export const checkRoutine = (routineId , message) => ({
  type: RoutinesActionTypes.CHECK_ROUTINE,
  payload: {routineId,message},
});

export const removeRoutine = (routineId) => ({
  type: RoutinesActionTypes.REMOVE_ROUTINE,
  payload: routineId,
});

export const addRoutine = (routine) => ({
  type: RoutinesActionTypes.ADD_ROUTINE,
  payload: routine,
});

export const skipRoutine = (routineId) => ({
  type: RoutinesActionTypes.SKIP_ROUTINE,
  payload: routineId,
});

export const editRoutine = (routine) => ({
  type: RoutinesActionTypes.EDIT_ROUTINE,
  payload: routine
})
