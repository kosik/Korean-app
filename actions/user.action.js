import types from './types';
import { request } from '../Api/api';

import NavigationService from '../routes/NavigationService';


// get reward fetch action
export function fetchGetRewards(payload) {
  return function (dispatch) {
    return request('get', '/users/me/rewards/')
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        dispatch(userUpdated(response))
      })
      .catch(error => {
        console.log('/users/me/rewards/ error', error)
      })
  }
}

// 완료한 재배치 작업 가져오기
export function fetchGetTransfers(payload) {
  return function (dispatch) {
    return request('get', '/users/me/transfers/?page_size=1000')
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }
        response.results.sort((a, b) => {
          if (a.id > b.id) {
            return -1;
          }
          if (a.id < b.id) {
            return 1;
          }
          return 0;
        })

        const newResults = response.results.filter(x => x.is_done)

        const payload = { transfer: { count: newResults.length, results: newResults } }
        dispatch(userUpdated(payload))
      })
      .catch(error => {
        console.log('/users/me/transfers/ error', error)
      })
  }
}

// 랭킹 정보 가져오기
export function fetchGetRank(payload) {
  return function (dispatch) {
    return request('get', '/transfers/rank/')
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        const loginedUserRank = response.findIndex(rank => {
          return rank.user_id == payload.id
        })
        dispatch(userUpdated({ ranking: response.slice(0, 100), loginedUserRank: loginedUserRank + 1, loginedUserRankingInfo: response[loginedUserRank] }))
      })
      .catch(error => {
        console.log('get /rewards/rank/ error', error)
      })
  }
}

export function fetchGetUserDistance(payload) {
  return function (dispatch) {
    return request('get', '/transfers/distance-rank/')
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }



        const loginedUserDistance = response.find(rank => {
          return rank.user_id == payload.id
        })


        dispatch(userUpdated({ loginedUserDistance: loginedUserDistance.rank / 1000 }))
      })
      .catch(error => {
        console.log('get /transfers/distance-rank/ error', error)
      })
  }
}

const userUpdated = (payload) => {
  return {
    type: types.USER_UPDATED,
    payload
  }
}