import types from '../actions/types';

const mapregion = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.045,
  longitudeDelta: 0.04,
};

const mapregionReducer = (state = mapregion, action) => {
  switch (action.type) {
    case types.REGION_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default mapregionReducer;
