import types from './types';
import { request } from '../Api/api';

import NavigationService from '../routes/NavigationService';

// 계좌 등록
export function fetchPostBank({ method, path, payload }) {
  return function (dispatch) {
    return request(method, path, payload)
      .then(response => {
        dispatch(bankUpdated({ isRegistered: true, ...response }))
      })
      .catch(error => {
        console.log('post /banks/ error', error)
      })
  }
}

// 내 계좌 가져오기
export function fetchGetBank(payload) {
  return function (dispatch) {
    return request('get', '/users/me/bank/')
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }
        dispatch(bankUpdated({ isRegistered: true, ...response }))
      })
      .catch(error => {
        console.log('get /users/me/bank/ error', error)
      })
  }
}


const bankUpdated = (payload) => {
  return {
    type: types.BANK_UPDATED,
    payload
  }
}