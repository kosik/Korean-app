import { Alert, AsyncStorage } from 'react-native';

import types from './types';

import * as Api from '../Api/api';
import * as geolib from 'geolib';

import Toast from '../components/Toast';
import NavigationService from '../routes/NavigationService';
import moment from 'moment';

// 실시간 대여소 정보 가져오기
function fetchBicycleData(lat, lng) {
  return function (dispatch) {
    dispatch(fetchBicycleDataRequest());
    return Api.getBicycleInfo()
      .then(responseData => {
        responseData.map(data => {
          data.stationLatitude = parseFloat(data.stationLatitude);
          data.stationLongitude = parseFloat(data.stationLongitude);

          return data;
        });

        dispatch(waiting(lat, lng, responseData));
      })
      .catch(error => {
        dispatch(fetchBicycleDataFailure(error));
      });
  };
}

const fetchBicycleDataRequest = () => {
  return {
    type: types.FETCH_BICYCLE_DATA_REQUEST,
    payload: {
      isFetching: true,
      loadingText: '주변 대여소를 불러오는 중입니다...'
    },
  };
};

const fetchBicycleDataSuccess = rentalData => {
  return {
    type: types.FETCH_BICYCLE_DATA_SUCCESS,
    payload: {
      isFetching: false,
      status: 'WAITING',
      rentaldata: rentalData,
      rl: true,
    },
  };
};

const fetchBicycleDataFailure = error => {
  return {
    type: types.FETCH_BICYCLE_DATA_FAILURE,
    payload: {
      isFetching: false,
      error,
    },
  };
};

const waiting = (lat, lng, rentaldata) => {

  const newRentalData = rentaldata
    .filter(station => {
      return geolib.isPointWithinRadius(
        { latitude: station.stationLatitude, longitude: station.stationLongitude },
        { latitude: lat, longitude: lng },
        2500
      )
    })


  const state = {
    status: 'WAITING',
    rentaldata: newRentalData,
    rl: true,
    isFetching: false,
  };
  return {
    type: types.WAITING,
    state,
  };
};

const findingRouteRequest = () => {

  return {
    type: types.FINDING_ROUTE_REQUEST,
    payload: {
      isFetching: true,
      loadingText: '재배치할 대여소를 탐색하는 중입니다...'
    },
  };
};

const findingRoute = (transferCandidate) => {
  return {
    type: types.FINDING_ROUTE,
    state: {
      status: 'FINDING_ROUTE',
      transferCandidate,
      isFetching: false,
    }
  }
}

const _findingRoute = (rentaldata, lat, lng) => async dispatch => {
  dispatch(findingRouteRequest())
  try {

    // 7개 이상
    // 현위치와 출발지 사이 거리 1km 이내
    const departureCandidate = rentaldata
      .filter(station => {
        return 7 <= station.parkingBikeTotCnt;
      })
      .filter(station => {
        return geolib.isPointWithinRadius(
          { latitude: station.stationLatitude, longitude: station.stationLongitude },
          { latitude: lat, longitude: lng },
          600)
      })
      .map(station => {
        station.distancefromCurrent = geolib.getDistance(
          { latitude: lat, longitude: lng },
          { latitude: station.stationLatitude, longitude: station.stationLongitude },
          1
        )

        return station;
      }).map(station => {
        station.walkTime = station.distancefromCurrent / 50;
        station.walkTime = Number.parseFloat(station.walkTime).toFixed(1)

        return station
      })
      .sort((a, b) => {
        return a.distancefromCurrent - b.distancefromCurrent
      })

    if (!departureCandidate.length) {
      Alert.alert('알림', '현재는 주변에 재배치가 필요한 대여소가 없습니다.')
      dispatch(missionComplete());
      return;
    }


    // 3개 이하
    // 출발지 ( departureCandidate ) 와 거리 1km 이상

    //  반경 100m 이내에 7대 이상인 대여소가 없어야 함. ( 200120 추가 )
    const conditionData = rentaldata
      .filter(station => {
        return 7 <= station.parkingBikeTotCnt;
      })

    const arrivalCandidate = rentaldata
      .filter(station => {
        return 3 >= station.parkingBikeTotCnt;
      })
      .filter(station => {
        // arrival 주변 100미터 찾아서 7대 이상인 대여소가 있으면 짜르기
        let isArrival = true;
        for (const conditionTransfer of conditionData) {
          if (geolib.isPointWithinRadius(
            { latitude: conditionTransfer.stationLatitude, longitude: conditionTransfer.stationLongitude },
            { latitude: station.stationLatitude, longitude: station.stationLongitude },
            100)) {
            isArrival = false
          }
        }
        if (isArrival) {
          return station
        }
      })

    if (!arrivalCandidate.length) {
      Alert.alert('알림', '현재는 주변에 재배치가 필요한 대여소가 없습니다.')
      dispatch(missionComplete());
      return;
    }

    const arrivalLimit = checkArrivalLimit(departureCandidate.length)


    let transferCandidate = []

    for (const departure of departureCandidate) {
      let i = 0
      for (const arrival of arrivalCandidate) {
        if (!geolib.isPointWithinRadius(
          { latitude: arrival.stationLatitude, longitude: arrival.stationLongitude },
          { latitude: departure.stationLatitude, longitude: departure.stationLongitude },
          600)) {
          transferCandidate.push({
            departure: departure,
            arrival: arrival,
            linealDistance: geolib.getDistance(
              { latitude: departure.stationLatitude, longitude: departure.stationLongitude },
              { latitude: arrival.stationLatitude, longitude: arrival.stationLongitude },
              1
            ),
            rl: departure.stationLongitude > arrival.stationLongitude
          })
          ++i;
        }
        if (transferCandidate.length == 5 || i == arrivalLimit) {
          break;
        }
      }
      if (transferCandidate.length == 5) {
        break;
      }
    }


    if (!transferCandidate.length) {
      Alert.alert('알림', '현재는 주변에 재배치가 필요한 대여소가 없습니다.')
      dispatch(missionComplete());
      return;
    }

    transferCandidate.map(transfer => {
      transfer.bicycleTime = transfer.linealDistance / 200;
      transfer.bicycleTime = Number.parseFloat(transfer.bicycleTime).toFixed(1)

      return transfer
    })


    const promises = transferCandidate.map(async transfer => {
      const origin = `${transfer.departure.stationLatitude},${transfer.departure.stationLongitude}`;
      const destination = `${transfer.arrival.stationLatitude},${transfer.arrival.stationLongitude}`;

      const distanceData = await Api.fetchGoogleDirectionApi(origin, destination)
      if (distanceData) {
        transfer.distanceData = distanceData;
      }
      return transfer;
    })

    // promise 병렬 실행 (fetch google direction Api)
    await Promise.all(promises)

    dispatch(findingRoute(transferCandidate))

  } catch (err) {
    console.log(err);
  }
};

//check arrival limit
const checkArrivalLimit = (length) => {
  switch (length) {
    case 0:
      return -1;
      break;
    case 1:
      return 5;
      break;
    case 2:
      return 3;
      break;
    default:
      return 2
      break;
  }
}

const goingDeparture = (selectedTransfer) => {
  const state = {
    status: 'GOING_DEPARTURE',
    selectedTransfer,
    isFetching: false,
  };
  return {
    type: types.GOING_DEPARTURE,
    state,
  };
};

// 재배치 transfer를 선택하고 출발지로 이동.
export function fetchCreateTransfers(payload) {
  const { selectedTransfer, user, latitude, longitude } = payload

  const body = {
    user_id: user.id,
    departure: selectedTransfer.departure.stationName,
    arrival: selectedTransfer.arrival.stationName,
    latitude: Number.parseFloat(latitude).toFixed(8),
    longitude: Number.parseFloat(longitude).toFixed(8),
  }

  return function (dispatch) {
    dispatch(stepUpdated({ isFetching: true, loadingText: '' }))
    return Api.request('post', '/transfers/', body)
      .then(response => {


        // 현재 재배치 작업 로컬 스토리지에 저장 ( 추후 완료되지 않은 작업 확인 용도 )
        AsyncStorage.multiSet([
          ['currentTransferId', response.id.toString()],
          ['transferData', JSON.stringify(selectedTransfer)],
          ['transferStatus', response.status]
        ])

        dispatch(goingDeparture(selectedTransfer))
        Toast.showToastMessage(`${moment().add(15, 'minutes').format('h시 mm분')}까지 출발지 대여소에 도달하여야 합니다`)

      })
      .catch(error => {
        console.log('fetch create trnasfer error', error)
      })
  }
}

const choosingBicycle = (rentaldata, coords, distance) => {
  const state = {
    status: 'CHOOSING_BICYCLE',
    rentaldata,
    coords,
    distance,
  };
  return {
    type: types.CHOOSING_BICYCLE,
    state,
  };
};

const onRoute = (selectedTransfer) => {
  const state = {
    status: 'ON_ROUTE',
    selectedTransfer,
    isFetching: false,
    loadingText: ''
  };
  return {
    type: types.ON_ROUTE,
    state,
  };
};

const returningBicycle = (rentaldata, coords, distance) => {
  const state = {
    status: 'RETURNING_BICYCLE',
    rentaldata,
    coords,
    distance,
  };
  return {
    type: types.RETURNING_BICYCLE,
    state,
  };
};

const missionComplete = () => {
  const rentaldata = [];

  const state = {
    status: 'MISSION_COMPLETE',
    rentaldata,
    isFetching: false,
    loadingText: ''
  };
  return {
    type: types.MISSION_COMPLETE,
    state,
  };
};

const stepUpdated = (payload) => {
  return {
    type: types.STEP_UPDATED,
    payload
  }
}

// 재배치 작업 업데이트 (도착지 저장 및 완료 처리) fetch action
export function fetchPatchTransfers(payload) {

  const { qrcode, selectedTransfer } = payload

  return function (dispatch) {
    dispatch(stepUpdated({ isFetching: true, loadingText: '' }))
    NavigationService.navigate('Main')
    return Api.request('patch', `/transfers/${payload.id}/`, payload.body)
      .then(response => {


        if (response.hasOwnProperty('detail')) {
          throw (response.detail)
        }

        switch (payload.body.status) {
          case 'I':
            //qr code data 서버에 저장
            dispatch(fetchCreateQRcodes({ transfer_id: response.id, name: selectedTransfer.departure.stationName, code: qrcode }))

            const limitedTime = moment().add(1, 'h')

            AsyncStorage.multiSet([
              ['transferStatus', response.status],
              ['limitedTime', JSON.stringify(limitedTime)]
            ])

            dispatch(onRoute(payload.selectedTransfer))

            Toast.showToastMessage(`${limitedTime.format('h시 mm분')}까지 도착지 대여소에 도달하여야 합니다`)
            break;

          case 'D':
            dispatch(fetchCreateQRcodes({ transfer_id: response.id, name: selectedTransfer.arrival.stationName, code: qrcode }))
            AsyncStorage.removeItem('currentTransferId')
            dispatch(completeTransfer())
            break;

          case 'F':
            Toast.showToastMessage('제한시간을 초과하여 재배치 작업이 취소되었습니다. 다시 참여해주세요!')
            AsyncStorage.removeItem('currentTransferId')
            dispatch(missionComplete())


          default:
            dispatch(missionComplete())
            break;
        }

      })
      .catch(error => {
        console.log('fetch patch transfers error', error)
        Toast.showToastMessage('제한시간을 초과하여 재배치 작업이 취소되었습니다. 다시 참여해주세요!')
        AsyncStorage.removeItem('currentTransferId')
        dispatch(missionComplete())

      })
  }
}

export function fetchCreateQRcodes(payload) {
  return function (dispatch) {
    return Api.request('post', `/qrcodes/`, payload)
      .then(response => {
      })
      .catch(error => {
        console.log('fetch Create Qrcodes error', error)
      })
  }
}


const completeTransfer = () => {
  const rentaldata = [];

  const state = {
    status: 'COMPLETE_TRANSFER',
    rentaldata,
    isFetching: false,
    loadingText: ''
  };
  return {
    type: types.COMPLETE_TRANSFER,
    state,
  };
};

export {
  waiting,
  findingRoute,
  _findingRoute,
  goingDeparture,
  choosingBicycle,
  onRoute,
  returningBicycle,
  missionComplete,
  fetchBicycleData,
  completeTransfer
};
