import types from '../actions/types';

const initialState = {
  transfer: {
    count: '',
    results: [],
    loginedUserDistance: 0
  }
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.USER_UPDATED:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default userReducer;
