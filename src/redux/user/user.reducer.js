import { UserActionTypes } from "./user.types";
import { addCoinToUser } from "./user.utils";

const INITIAL_STATE = {
  currentUser: null,
};
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.ADD_COIN:
      return {
        ...state,
        currentUser: addCoinToUser(state.user),
      };
    case UserActionTypes.ADD_SKIP:
      state.currentUser.coins = +state.currentUser.coins - 10;
      return {
        ...state,
        currentUser: {...state.currentUser},
      };
    default:
      return state;
  }
};

export default userReducer;
