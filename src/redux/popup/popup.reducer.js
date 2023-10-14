

const INITIAL_STATE = {
  popup: {
    payload: '',
    type: '',
  }
};

const popupReducer = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    popup: action.type === 'persist/REHYDRATE' ?
      {}
      :
      { payload: action.payload, type: action.type }
  };
};

export default popupReducer;
