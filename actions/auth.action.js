import types from './types';
import { request } from '../Api/api';

import { AsyncStorage } from 'react-native';
import NavigationService from '../routes/NavigationService';
import Toast from '../components/Toast';
import { missionComplete } from './step.actions';
import { fetchGetRank, fetchGetUserDistance, fetchGetTransfers } from './user.action';

// login fetch actions
export function fetchLogin(payload) {

  return function (dispatch) {
    dispatch(loginRequest())
    return request('post', 'auth/jwt/create', payload, false)
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        // save token in device storage.
        AsyncStorage.multiSet([
          ['access', response.access],
          ['refresh', response.refresh]
        ])

        dispatch(loginSuccess(response))

        NavigationService.navigate('Main')
      })
      .catch(error => {
        dispatch(loginFailure(error))
        Toast.showToastMessage('아이디 또는 패스워드를 확인해주세요.', 100)
      })
  }
}

// auth token refresh fetch action
export function fetchRefreshToken(payload) {
  return function (dispatch) {
    dispatch(loginRequest())
    return request('post', 'auth/jwt/refresh/', payload, false)
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        AsyncStorage.setItem('access', response.access)

        dispatch(fetchGetUser())

        dispatch(loginSuccess(response))

        NavigationService.navigate('Main')
      })
      .catch(error => {
        dispatch(loginFailure(error))
      })
  }
}

// logout fetch action
export function fetchLogout() {
  return function (dispatch) {
    return AsyncStorage.clear().then(() => {
      NavigationService.navigate('SignIn')
      dispatch(logout({ refresh: '', access: '' }))
      dispatch(missionComplete())
    })
  }
}

// create user fetch action
export function fetchCreateUser(payload) {
  return function (dispatch) {
    dispatch(loginRequest())
    return request('post', 'auth/users/', payload, false)
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }
        dispatch(createSuccess(response))
        NavigationService.navigate('PhoneAuth')
      }).catch(error => {
        console.log('fetchCreateUser error :: ', error)
        dispatch(loginFailure(error))
      })

  }
}

// get user info fetch action
export function fetchGetUser() {

  return function (dispatch) {
    return request('get', 'users/me/')
      .then(response => {
        dispatch(authUpdated({ loginedUser: response }))
        dispatch(fetchGetRank({ id: response.id }))
        dispatch(fetchGetUserDistance({ id: response.id }))
        dispatch(fetchGetTransfers())
        dispatch(fetchGetNotice())
      })
      .catch(error => {
        console.log('get user error', error)
      })
  }
}

const loginRequest = () => {
  return {
    type: types.AUTH_UPDATED,
    payload: {
      isAuthLoading: true,
      error: null
    }
  }
}

const loginSuccess = (payload) => {
  return {
    type: types.AUTH_UPDATED,
    payload: {
      ...payload,
      isAuthLoading: false,
    }
  }
}

const loginFailure = (error) => {
  return {
    type: types.AUTH_UPDATED,
    payload: {
      error,
      isAuthLoading: false,
    }
  }
}

const logout = (payload) => {
  return {
    type: types.AUTH_UPDATED,
    payload
  }
}

const createSuccess = (payload) => {
  return {
    type: types.AUTH_UPDATED,
    payload: {
      ...payload,
      isAuthLoading: false,
    }
  }
}

export const authUpdated = (payload) => {
  return {
    type: types.AUTH_UPDATED,
    payload
  }
}

// user phone authentication fetch action
export function fetchPostUserActivation(payload) {
  return function (dispatch) {
    dispatch(loginRequest())
    return request('post', '/users/activation', payload, false)
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }
        dispatch(loginSuccess({}))
        Toast.showToastMessage('가입 완료!')
        NavigationService.navigate('SignIn')
      })
      .catch(error => {
        console.log('post /users/activation error', error)
        dispatch(loginFailure(error))
      })
  }
}

// 정보 변경
export function fetchCertificate(payload) {
  const { body } = payload
  return function (dispatch) {
    return request('post', '/users/send_sms', payload.body)
      .then(response => {
        Toast.showToastMessage('인증번호를 입력해주세요.')
      })
      .catch(error => {
        console.log('fetch Certificate error', error)
        Toast.showToastMessage('핸드폰 번호를 확인해주세요.')
      })
  }
}

export function fetchVerifyCertificateNumber(payload) {
  const { body } = payload
  return function (dispatch) {
    return request('post', '/users/send_sms/verify', body)
      .then(response => {

        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        if (response.hasOwnProperty('success') && response.success) {
          dispatch(authUpdated({ isCertificate: true }))
          Toast.showToastMessage('번호 인증이 완료되었습니다.')
        }

      })
      .catch(error => {
        Toast.showToastMessage('번호 인증에 실패하였습니다.')
      })
  }
}

export function fetchPostEditInfo(payload) {
  const { body } = payload
  return function (dispatch) {
    return request('patch', '/auth/users/me/', body)
      .then(response => {
        dispatch(authUpdated({ isCertificate: false, loginedUser: response }))
        NavigationService.navigate('MyInfo')
        Toast.showToastMessage('정보 변경이 완료되었습니다.')
      })
      .catch(error => {
        console.log('fetchPostEditInfo error', error)
      })
  }
}

export function fetchPostChangePassword(payload) {
  const { body } = payload
  return function (dispatch) {
    return request('post', '/auth/users/set_password/', body)
      .then(response => {
        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        Toast.showToastMessage('비밀번호 변경이 완료되었습니다.')
        dispatch(authUpdated({ changePasswordError: null }))
      })
      .catch(error => {
        console.log('fetchPostChangePassword error', error)
        Toast.showToastMessage('현재 비밀번호가 다릅니다.')
        dispatch(authUpdated({ changePasswordError: error }))
      })
  }
}

export function fetchGetNotice() {
  return function (dispatch) {
    return request('get', '/ds/notices/')
      .then(response => {
        AsyncStorage.getItem('noticeDate').then(noticeDate => {
          if (noticeDate !== response[0].updated_at) {
            dispatch(authUpdated({ isPopupVisible: true, notice: response[0] }))
          }
        })
      })
      .catch(error => {
        console.log('get notice error', error)
      })
  }
}