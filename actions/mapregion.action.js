import types from './types';

const regionChange = newCoordinate => {
  return {
    type: types.REGION_CHANGE,
    payload: {
      ...newCoordinate
    },
  };
};

export { regionChange };
