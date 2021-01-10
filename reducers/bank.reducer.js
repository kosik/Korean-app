import types from '../actions/types';

const initialState = {
};

const bankReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.BANK_UPDATED:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default bankReducer;
