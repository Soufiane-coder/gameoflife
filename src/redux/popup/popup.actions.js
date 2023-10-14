import { popupActionTypes } from "./popup.types";

export const hidePopup = () => ({
  type: popupActionTypes.HIDE_POPUP,
  payload: false,
})

export const displayCheckPopupState = (state) => ({
  type: popupActionTypes.CHECK_POPUP,
  payload: state,
});

export const displayMessagePopupState = (state) => ({
  type: popupActionTypes.MESSAGE_POPUP,
  payload: state,
});

export const displayAddRoutinePopupState = (state) => ({
  type: popupActionTypes.ADD_ROUTINE_POPUP,
  payload: state,
});


