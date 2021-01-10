import types from '../actions/types';

const step = {
  status: 'MISSION_COMPLETE',
  rentaldata: [],
  rl: true,
  isFetching: false,
  loadingText: 'loading...',
  coords: null,
  distance: '1.0 km',
  transferCandidate: [],
  selectedTransfer: null
};

const stepReducer = (state = step, action) => {
  switch (action.type) {
    case types.WAITING:
      return { ...state, ...action.state };;
    case types.FINDING_ROUTE:
      return { ...state, ...action.state };;
    case types.GOING_DEPARTURE:
      return { ...state, ...action.state };
    case types.CHOOSING_BICYCLE:
      return { ...state, ...action.state };;
    case types.ON_ROUTE:
      return { ...state, ...action.state };;
    case types.RETURNING_BICYCLE:
      return { ...state, ...action.state };;
    case types.MISSION_COMPLETE:
      return { ...state, ...step };;
    case types.FETCH_BICYCLE_DATA_REQUEST:
      return { ...state, ...action.payload };
    case types.FETCH_BICYCLE_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case types.FETCH_BICYCLE_DATA_FAILURE:
      return { ...state, ...action.payload };
    case types.FINDING_ROUTE_REQUEST:
      return { ...state, ...action.payload };
    case types.STEP_UPDATED:
      return { ...state, ...action.payload };
    case types.COMPLETE_TRANSFER:
      return { ...state, ...action.state };

    default:
      return state;
  }
};

export default stepReducer;
