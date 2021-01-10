import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  AsyncStorage
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Polyline } from 'react-native-maps';

import TransferCard from '../../components/TransferCard';

import { Ionicons } from '@expo/vector-icons';

import FetchIndicator from '../../components/FetchIndicator';
import Carousel from 'react-native-snap-carousel';

import { Popup } from '../../components/Popup';
import TransferDataCard from '../../components/TransferDataCard';
import CompleteTransferCard from '../../components/CompleteTransferCard';

const { width, height } = Dimensions.get('window');


class Presenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [
        { title: 11111 },
        { title: 22222 },
        { title: 343333 },

      ],
    }

    this._carousel = null;
  }


  // 하단 버튼 표시
  renderStatusButton = (text, onPress) => {
    return (
      Platform.OS === 'android' ?
        <TouchableNativeFeedback onPress={onPress}>
          <View style={styles.button}>
            <Text style={styles.resetText}>{text}</Text>
          </View>
        </TouchableNativeFeedback>
        :
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={styles.resetText}>{text}</Text>
        </TouchableOpacity>
    )
  }

  // 재배치 대여소 카드 표시
  renderStationInfo = (text, onPress, scrollEnabled = false) => {
    const { step: { transferCandidate }, step } = this.props;

    return (
      <React.Fragment>

        <View style={{
          position: 'absolute',
          bottom: '10%',
          flexDirection: 'column',
        }}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={transferCandidate}
            renderItem={({ item, index }) => { return <TransferCard transfer={item} index={index} /> }}
            itemWidth={width - 50}
            sliderWidth={width}
            layout={'default'}
            scrollEnabled={scrollEnabled}
            activeSlideOffset={1}
          />
        </View>


        {this.renderStatusButton(text, onPress)}
      </React.Fragment>
    )
  }

  renderStationCard = (text, onPress) => {
    const { step: { transferCandidate, selectedTransfer }, step, } = this.props;

    return (
      <React.Fragment>

        <TransferDataCard
          transfer={selectedTransfer}
          isAlone={true}
        />

        {this.renderStatusButton(text, onPress)}
      </React.Fragment>
    )
  }

  renderRewardCard = (text, onPress) => {

    return (
      <React.Fragment>

        <CompleteTransferCard />

        {this.renderStatusButton(text, onPress)}
      </React.Fragment>
    )
  }

  // status 에 따른 버튼 분류
  switchStepStatus = (status) => {
    const {
      location,
      step, waiting,
      findingRoute,
      goingDeparture,
      choosingBicycle,
      navigate,
      returningBicycle,
      toastVisible,
      stepActions,
      missionComplete,
      auth
    } = this.props;
    const { coords: { latitude, longitude } } = location;
    const { rentaldata, coords, distance, transferCandidate, selectedTransfer } = step;

    switch (status) {
      case 'MISSION_COMPLETE':
        return this.renderStatusButton(
          '참여하기',
          () => waiting(!toastVisible, latitude, longitude))
        break;

      case 'WAITING':
        return this.renderStatusButton(
          '재배치 대여소 탐색',
          () => findingRoute(rentaldata, latitude, longitude))
        break;

      case 'FINDING_ROUTE':
        return this.renderStationInfo(
          '선택',
          () => stepActions.fetchCreateTransfers({
            user: auth.loginedUser,
            selectedTransfer: transferCandidate[this._carousel.currentIndex],
            latitude: Number.parseFloat(latitude).toFixed(8),
            longitude: Number.parseFloat(longitude).toFixed(8),
          }), true)
        break;

      case 'GOING_DEPARTURE':
        return this.renderStationCard(
          '출발지 도착(테스트용)',
          () => choosingBicycle(rentaldata, coords, distance))
        break;

      case 'CHOOSING_BICYCLE':
        return this.renderStationCard(
          'QR 코드로 자전거 대여하기',
          () => navigate('QR'))
        break;

      case 'ON_ROUTE':
        return this.renderStationCard(
          '목적지 도착',
          () => returningBicycle(rentaldata, coords, distance))
        break;

      case 'RETURNING_BICYCLE':
        return this.renderStationCard(
          'QR 코드로 자전거 반납하기',
          () => navigate('QR'))
        break;

      case 'COMPLETE_TRANSFER':
        return this.renderRewardCard(
          '확인',
          () => missionComplete())
        break;

      default:
        return null;
        break;
    }
  }

  // 상단 토스트 메시지 표시
  renderToastMessage = (text, isReturn = false) => {
    handlePress = () => {

      if (isReturn) {
        Alert.alert(null, '첫화면으로 돌아가시겠습니까?', [
          {
            text: '네',
            onPress: () => {
              this.props.missionComplete()
              this.props.setToastVisible(!this.props.toastVisible)
            }
          },
          {
            text: '아니오',
          }
        ])
      }
      else {
        this.props.setToastVisible(!this.props.toastVisible)
      }

    }
    return (
      <View style={styles.modalView}>
        <View style={{ width: 35, height: 35 }} />
        <View style={styles.modalTextContainer}>
          <Text style={styles.modalText}>{text}</Text>
        </View>
        <TouchableOpacity
          onPress={handlePress}>
          <Ionicons style={styles.modalIcon} name="md-close" size={35} />
        </TouchableOpacity>
      </View>
    )
  }

  // status 에 따른 토스트 메시지 분류
  switchToastMessage = (status) => {
    switch (status) {
      case 'WAITING':
        return this.renderToastMessage('날라 임무 대기 중 입니다.')
        break;

      case 'FINDING_ROUTE':
        return this.renderToastMessage('임무를 선택하세요.', true)
        break;

      case 'GOING_DEPARTURE':
        return this.renderToastMessage('날라 임무를 위해 걸어가는 중입니다 🏃🏻‍♀️')
        break;

      case 'CHOOSING_BICYCLE':
        return this.renderToastMessage('나를 자전거를 선택해주세요.')
        break;

      case 'ON_ROUTE':
        return this.renderToastMessage('날라 임무 수행 중입니다 🚴‍♂️')
        break;

      case 'RETURNING_BICYCLE':
        return this.renderToastMessage('날라 임무 수행 중입니다 🚴‍♂️')
        break;

      default:
        return null
        break;
    }
  }

  // 대여소 마커 표시
  renderStationMarker = (marker, icon) => {

    return (
      <Marker
        key={marker.stationId}
        coordinate={{ latitude: marker.stationLatitude, longitude: marker.stationLongitude }}
        icon={icon}>
        <Callout tooltip={true}>
          <View style={styles.calloutView}>
            <Text style={styles.calloutTitleText}>{marker.stationName}</Text>
            <Text style={styles.calloutText}>{"재고" + " " + marker.parkingBikeTotCnt + " " + "/" + " " + marker.rackTotCnt + "대"}</Text>
          </View>
        </Callout>
      </Marker>
    )
  }


  handlePressNoticeNever = () => {
    AsyncStorage.setItem('noticeDate', this.props.auth.notice.updated_at)
    this.props.authActions.authUpdated({ isPopupVisible: false })
  }

  render() {
    const { currentLocFile,
      location,
      mapregion,
      regionChange,
      step,
      toastVisible,
      setToastVisible,
      openDrawer,
      waiting,
      findingRoute,
      goingDeparture,
      choosingBicycle,
      onRoute,
      returningBicycle,
      missionComplete,
      navigate,
      isFetching,
      auth } = this.props;

    const { transferCandidate, selectedTransfer } = step;

    const colors = ['red', 'blue', 'green', 'yellow', 'purple']
    const num = [10, 8, 6, 4, 2]



    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          followsUserLocation={true}
          rotateEnabled={false}
          showsTraffic={true}
          onUserLocationChange={() => {
            this.map.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: mapregion.latitudeDelta,
              longitudeDelta: mapregion.longitudeDelta
            })
          }}
          // 아래 부분을 region 으로 바꾸어서 사용하시면 됩니다.
          ref={ref => (this.map = ref)}
          initialRegion={{
            latitude: mapregion.latitude,
            longitude: mapregion.longitude,
            latitudeDelta: mapregion.latitudeDelta,
            longitudeDelta: mapregion.longitudeDelta
          }}
        >

          {/* 대여소 표시 */}
          {step.status === 'WAITING' | step.status === 'MISSION_COMPLETE' ?
            (step.rentaldata.map(marker => {
              if (marker.parkingBikeTotCnt == 0) {
                return this.renderStationMarker(marker, this.map.__lastRegion.latitudeDelta < 0.1 ? require('../../res/station_pin0.png') : require('../../res/point15red-2.png'))
              } else if (marker.parkingBikeTotCnt <= 3) {
                return this.renderStationMarker(marker, this.map.__lastRegion.latitudeDelta < 0.1 ? require('../../res/station_pin1.png') : require('../../res/point15red-2.png'))
              } else if (marker.parkingBikeTotCnt <= 6) {
                return this.renderStationMarker(marker, this.map.__lastRegion.latitudeDelta < 0.1 ? require('../../res/station_pin4.png') : require('../../res/point15yellow-2.png'))
              } else {
                return this.renderStationMarker(marker, this.map.__lastRegion.latitudeDelta < 0.1 ? require('../../res/station_pin7.png') : require('../../res/point15green-2.png'))
              }
            }))
            : null
          }

          {/* 대여소 후보 표시 === 이렇게 해야 마커가 똑바로 이동함 */}
          {step.status === 'FINDING_ROUTE' && step.coords !== '찾는 길이 없습니다.' ?
            (

              step.transferCandidate.map((transfer, index) => {
                if (this._carousel == null) {
                  return null
                }
                if (this._carousel.currentIndex !== index) {
                  return null
                }
                return (
                  <View key={index}>
                    {this.renderStationMarker(transfer.departure, transfer.rl ? require('../../res/signStart.png') : require('../../res/signStart.png'))}
                    {this.renderStationMarker(transfer.arrival, require('../../res/signArrive.png'))}
                    <Polyline
                      coordinates={transfer.distanceData.coords}
                      strokeWidth={4}
                      strokeColor={'#00d980'} />
                  </View>
                )
              })

            )
            :
            null}

          {step.status === 'GOING_DEPARTURE' || step.status === 'CHOOSING_BICYCLE' || step.status === 'ON_ROUTE' || step.status === 'RETURNING_BICYCLE' ?
            <View>
              {this.renderStationMarker(selectedTransfer.departure, selectedTransfer.rl ? require('../../res/signStart.png') : require('../../res/signStart.png'))}
              {this.renderStationMarker(selectedTransfer.arrival, require('../../res/signArrive.png'))}
              <Polyline
                coordinates={selectedTransfer.distanceData.coords}
                strokeWidth={4}
                strokeColor={'#00d980'} />
            </View>
            : null
          }


          {/* 내 현재 위치 표시 */}
          <Marker
            ref={ref => { this.currentMarker = ref; }}
            coordinate={location.coords}
            icon={currentLocFile ? require('../../res/current_location_icon.png') : require('../../res/current_location_icon.png')}>
          </Marker>
        </MapView>

        {/* 메뉴 */}
        <TouchableOpacity onPress={() => openDrawer()} style={styles.menuView}>
          <Ionicons name={Platform.OS === 'ios' ? "ios-menu" : 'md-menu'} size={Platform.OS === 'ios' ? 35 : 30} />
        </TouchableOpacity>


        {/* 하단 선택 창 */}
        {this.switchStepStatus(step.status)}

        {/* 상단 팝업 */}
        {toastVisible ? this.switchToastMessage(step.status) : null}

        {/* fetchingIndicator */}
        <FetchIndicator
          isFetching={isFetching}
          centerIndicator
          infoText={step.loadingText}
        />
        {/* 공지사항 팝업 */}
        {
          auth.isPopupVisible && <Popup
            header={'공지사항'}
            body={auth.notice.message}
            onPressNever={this.handlePressNoticeNever}
            onPressConfirm={() => this.props.authActions.authUpdated({ isPopupVisible: false })}
          />
        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  menuView: {
    position: 'absolute',
    top: '6%',
    right: '6%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 50,
    paddingVertical: Platform.OS === 'ios' ? 9 : 11,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0FD97E',
    paddingVertical: 20,
  },
  resetText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  calloutView: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calloutTitleText: {
    fontWeight: 'bold',
    fontSize: 12
  },
  calloutText: {
    color: '#7f7f7f',
    fontSize: 11
  },
  modalView: {
    position: 'absolute',
    top: '6%',
    width: width - 20,
    elevation: 25,
    backgroundColor: '#3c5665',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  modalTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalIcon: {
    paddingHorizontal: 5,
    color: '#ffffff'
  },
  modalBottomView: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'black',
    opacity: 0.5
  }
});

export default Presenter;