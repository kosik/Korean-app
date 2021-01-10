import React from 'react';
import { BackHandler, Platform, ToastAndroid, AsyncStorage, Alert } from 'react-native';

import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';
import ActionCreator from '../../actions';

import Presenter from './presenter';
import Toast from 'react-native-root-toast';
import { bindActionCreators } from 'redux';
import * as stepActions from '../../actions/step.actions';
import * as authActions from '../../actions/auth.action';
import FetchIndicator from '../../components/FetchIndicator';


class App extends React.Component {
  state = {
    location: {
      coords: {
        latitude: 37.541363,
        longitude: 127.017662,
      },
    },
    errorMessage: null,
    toastVisible: true,
    currentLocFile: true,
    duration: 2000,
    position: -150,
    toastMessage: ''
  };

  _waiting = (visible, lat, lng) => {
    this._setToastVisible(visible);
    this.props.waiting(lat, lng);
  };

  _findingRoute = async (rentaldata, lat, lng) => {
    this._setToastVisible(true);
    this.props.findingRoute(rentaldata, lat, lng);
  };

  _goingDeparture = (selectedTransfer) => {
    this._setToastVisible(true);
    this.props.goingDeparture(selectedTransfer);
  };

  _choosingBicycle = (rentaldata, coords, distance) => {
    this._setToastVisible(true);
    this.props.choosingBicycle(rentaldata, coords, distance);
  };

  _onRoute = (selectedTransfer) => {
    this._setToastVisible(true);
    this.props.onRoute(selectedTransfer);
  };

  _returningBicycle = (rentaldata, coords, distance) => {
    this._setToastVisible(true);
    this.props.returningBicycle(rentaldata, coords, distance);
  };

  _missionComplete = () => {
    this._setToastVisible(true);
    this.props.missionComplete();
  };

  _setToastVisible = visible => {
    this.setState({
      toastVisible: visible,
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        toastMessage: '위치 정보 수신 권한을 획득하지 못했습니다. 설정에서 권한을 변경해주세요.',
      })
      this.showToastMessage()
      this.props.authActions.fetchLogout()
      return
    }

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          location: position,
        });

        const { latitude, longitude } = position.coords;
        const newCoordinate = {
          latitude,
          longitude,
        };

        this.props.regionChange(newCoordinate)

        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {

        }
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
  };

  _handleBackButton = () => {
    const parent = this.props.navigation.dangerouslyGetParent();
    const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

    const { step: { status } } = this.props

    // drawer 메뉴가 열려있을 때 닫기
    if (isDrawerOpen) {
      this.props.navigation.closeDrawer();
      return true;
    }

    if (status == 'FINDING_ROUTE') {
      Alert.alert(null, '첫화면으로 돌아가시겠습니까?', [
        {
          text: '네',
          onPress: () => {
            this._missionComplete()
          }
        },
        {
          text: '아니오',
        }
      ])
      return true;
    }

    // 2초 안에 back 버튼을 2번 터치하면 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      this.setState({
        toastMessage: '한 번 더 누르시면 종료됩니다.',
      })
      this.showToastMessage()

      this.exitApp = true;
      this.timeout = setTimeout(() => {
        this.exitApp = false;
      }, 2000);
    } else {
      clearTimeout(this.timeout);
      this.exitApp = false;
      BackHandler.exitApp();
    }
    return true;
  };

  checkPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    console.log('status', status)
    if (status === 'undetermined') {
      Alert.alert('위치 권한 설정', 'nalla를 사용하는 동안 해당 앱이 사용자의 위치에 접근하도록 허용하겠습니까?', [
        { text: '예', onPress: () => this._getLocationAsync() },
        {
          text: '아니오', onPress: () => {
            this.setState({
              toastMessage: '위치 정보 수신 권한을 획득하지 못했습니다.',
            })
            this.showToastMessage()
            this.props.authActions.fetchLogout()
          }
        }
      ])
    }
    else {
      this._getLocationAsync()
    }
  }

  componentDidMount() {
    this.checkPermission()
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    this.currentInterval = setInterval(() => {
      this.setState({
        currentLocFile: !this.state.currentLocFile,
      });
    }, 500);

    // 완료되지 않은 재배치 작업이 있는지 확인하여 불러오기
    AsyncStorage.getItem('currentTransferId')
      .then(id => {
        if (id) {
          AsyncStorage.getItem('transferData')
            .then(transferData => {
              AsyncStorage.getItem('transferStatus')
                .then(transferStatus => {
                  switch (transferStatus) {
                    case 'R':
                      this._goingDeparture(JSON.parse(transferData))
                      break;

                    case 'I':
                      this._onRoute(JSON.parse(transferData))
                      break;

                    default:
                      break;
                  }

                  this.setState({
                    toastMessage: '종료되지 않은 임무를 이어합니다.',
                  })
                  this.showToastMessage()
                })

            })
        }
      })

    AsyncStorage.get


  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: '안드로이드 에뮬레이터에서 실행되지 않습니다. 실제 디바이스를 써주세요',
      });
    }
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    navigator.geolocation.clearWatch(this.watchId);
    clearInterval(this.currentInterval)
  }

  showToastMessage = () => {
    this.toast = Toast.show(this.state.toastMessage, {
      duration: this.state.duration,
      position: this.state.position,
      onPress: () => {
        alert('You clicked me!')
      },
      onHidden: () => {
        this.toast.destroy();
        this.toast = null;
      }
    });
  };

  render() {
    const { mapregion } = this.props;

    if (!!(mapregion.latitude && mapregion.longitude)) {
      return <Presenter
        currentLocFile={this.state.currentLocFile}
        location={this.state.location}
        mapregion={this.props.mapregion}
        regionChange={this.props.regionChange}
        step={this.props.step}
        toastVisible={this.state.toastVisible}
        setToastVisible={this._setToastVisible}
        openDrawer={this.props.navigation.openDrawer}
        waiting={this._waiting}
        findingRoute={this._findingRoute}
        goingDeparture={this._goingDeparture}
        choosingBicycle={this._choosingBicycle}
        onRoute={this._onRoute}
        returningBicycle={this._returningBicycle}
        missionComplete={this._missionComplete}
        navigate={this.props.navigation.navigate}
        isFetching={this.props.step.isFetching}
        stepActions={this.props.stepActions}
        auth={this.props.auth}
        authActions={this.props.authActions}
      />
    }
    else return <FetchIndicator
      isFetching={true}
      centerIndicator />;
  }
}

const mapStateToProps = state => {
  return {
    mapregion: state.mapregion,
    step: state.step,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    regionChange: newCoordinate => {
      dispatch(ActionCreator.regionChange(newCoordinate));
    },
    waiting: (lat, lng) => {
      dispatch(ActionCreator.fetchBicycleData(lat, lng));
    },
    findingRoute: (rentaldata, lat, lng) => {
      dispatch(ActionCreator._findingRoute(rentaldata, lat, lng));
    },
    goingDeparture: (selectedTransfer) => {
      dispatch(ActionCreator.goingDeparture(selectedTransfer));
    },
    choosingBicycle: (rentaldata, coords, distance) => {
      dispatch(ActionCreator.choosingBicycle(rentaldata, coords, distance));
    },
    onRoute: (selectedTransfer) => {
      dispatch(ActionCreator.onRoute(selectedTransfer));
    },
    returningBicycle: (rentaldata, coords, distance) => {
      dispatch(ActionCreator.returningBicycle(rentaldata, coords, distance));
    },
    missionComplete: () => {
      dispatch(ActionCreator.missionComplete());
    },
    stepActions: bindActionCreators(stepActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
