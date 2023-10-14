import { UserActionTypes } from "./user.types";

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const addCoin = () => ({
  type: UserActionTypes.ADD_COIN,
  payload: null,
});

export const buySkip = () => ({
  type: UserActionTypes.ADD_SKIP,
  payload: null,
});
