import { RoutinesActionTypes } from "./routines.types";
import { checkRoutine, removeRoutine, skipRoutine , changeArchivedOption, editRoutine} from "./routines.utils";


const INITIAL_STATE = {
  routines: null,
};

const routinesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RoutinesActionTypes.SET_CURRENT_ROUTINES:
      return {
        ...state,
        routines: action.payload,
      };
    case RoutinesActionTypes.CHECK_ROUTINE:
      return {
        ...state,
        routines: checkRoutine(state.routines, action.payload),
      };
    case RoutinesActionTypes.CHANGE_ARCHIVE_OPTION:
      return {
        ...state,
        routines: changeArchivedOption(state.routines, action.payload.routineId, action.payload.archivedOption),
      };
    case RoutinesActionTypes.ADD_ROUTINE: {
      state.routines.unshift(action.payload);
      return {
        ...state,
        routines: [...state.routines],
      };
    }
    case RoutinesActionTypes.REMOVE_ROUTINE: {
      return {
        ...state,
        routines: [...removeRoutine(state.routines, action.payload)],
      };
    }
    case RoutinesActionTypes.SKIP_ROUTINE: {
      return {
        ...state,
        routines: skipRoutine(state.routines, action.payload),
      };
    }
    case RoutinesActionTypes.EDIT_ROUTINE: {
      return {
        ...state,
        routines: editRoutine(state.routines, action.payload)
      }
    }
    default:
      return state;
  }
};

export default routinesReducer;
