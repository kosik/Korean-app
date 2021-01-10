import types from '../actions/types';

const initialState = {
  access: '',
  refresh: '',
  email: '',
  name: '',
  phone_number: '',
  loginedUser: {},
  isAuthLoading: false,
  error: null,
  isCertificate: false,
  changePasswordError: null,
  isPopupVisible: false
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.AUTH_UPDATED:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default authReducer;
