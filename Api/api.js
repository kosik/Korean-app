import { AsyncStorage } from 'react-native';


// 실시간 대여소 정보 통신
function getBicycleInfo() {
  let bicycleInfo = [];
  let startIndex = 1;
  let endIndex = 1000;

  const fetchBicycleInfo = () => {
    const request = new Request(
      `http://openapi.seoul.go.kr:8088/4b65754866776865353867554b7063/json/bikeList/${startIndex}/${endIndex}/`,
      {
        method: 'GET',
      },
    );
    return fetch(request)
      .then(response => response.json())
      .then(responseData => {
        if (responseData.CODE == "INFO-200") {
          return bicycleInfo
        }
        const { list_total_count, row, RESULT } = responseData.rentBikeStatus;

        if (list_total_count < 1000) {
          bicycleInfo = bicycleInfo.concat(row);
          return bicycleInfo;
        } else {
          bicycleInfo = bicycleInfo.concat(row);
          startIndex += list_total_count;
          endIndex += list_total_count;
          return fetchBicycleInfo();
        }
      })
      .catch(error => {
        console.log('api call error', error)
        return error;
      });
  };

  return fetchBicycleInfo();
}

// 서버 통신
const request = async (method = 'get', path = '', body = {}, isHeaders = true) => {

  const headers = { 'Content-Type': 'application/json' }

  if (isHeaders) {
    await AsyncStorage.getItem('access').then(access => {
      headers.Authorization = `JWT ${access}`
    })
  }

  const options = {
    method,
    headers
  }

  if (options.method.toLowerCase() !== 'get') {
    options.body = JSON.stringify(body);
  }

  const request = new Request(`http://server-dev.zpru4uymkk.ap-northeast-2.elasticbeanstalk.com/${path}`, options);
  return fetch(request).then(response => {

    if (!response.ok) {
      return response.json().then(response => { return { detail: response } })
    }
    return response.json()
  }
  ).catch(error => {
    console.log('api request error', error)
    return error
  })
}

// 구글 길찾기 api
const fetchGoogleDirectionApi = async (origin, destination) => {
  const APIKEY = 'AIzaSyDZfUrm0u5sE0AkQ9kMl9lhdMXV0MJ3SDo';
  const mode = 'transit';
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;

  const decode = (t, e) => {
    for (
      var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5);
      u < t.length;

    ) {
      (a = null), (h = 0), (i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (o = 1 & i ? ~(i >> 1) : i >> 1), (l += n), (r += o), d.push([l / c, r / c]);
    }
    return (d = d.map(function (t) {
      return { latitude: t[0], longitude: t[1] };
    }));
  };

  const res = await fetch(url);
  const resJson = await res.json();

  if (resJson.status === 'ZERO_RESULTS') {
    return false;
    coords = '찾는 길이 없습니다.';
  } else {
    const coords = decode(resJson.routes[0].overview_polyline.points);
    const distance = resJson.routes[0].legs[0].distance.text;
    return { coords, distance };
  }

}
export { getBicycleInfo, request, fetchGoogleDirectionApi };
