import React from 'react';
import { Text, View, StyleSheet, Button, Dimensions, TouchableNativeFeedback, TouchableOpacity, Modal, Platform, AsyncStorage, BackHandler } from 'react-native';
import { withNavigationFocus } from 'react-navigation';


import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';


import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import ActionCreator from '../../actions';
import { bindActionCreators } from 'redux';
import * as stepActions from '../../actions/step.actions';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

class QR extends React.Component {
  state = {
    hasCameraPermission: null,
    flashMode: false,
    scanned: false,
    modalVisible: false,
    message1: null,
    message2: null,
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this._getPermissionAsync();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }

  _flashOnOff = async visible => {
    this.setState({
      flashMode: visible,
    });
  };

  _getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  // QR 코드 촬영 완료 후 서버에 저장.
  _handleQRScanned = async ({ type, data }) => {
    const { loginedUser, step: { status, rentaldata, coords, distance, selectedTransfer }, mapregion: { latitude, longitude } } = this.props

    // 재배치 시작 qr 코드 촬영
    if (status === 'CHOOSING_BICYCLE') {

      const payload = {
        body: {
          status: 'I',
          latitude: Number.parseFloat(latitude).toFixed(8),
          longitude: Number.parseFloat(longitude).toFixed(8),
        },
        selectedTransfer,
        qrcode: data
      }

      await AsyncStorage.getItem('currentTransferId').then(id => {
        payload.id = parseInt(id);
      })

      this.props.actions.fetchPatchTransfers(payload)

      this.setState({ scanned: true });
      await setTimeout(() => {
        this.setState({ scanned: false });
      }, 3000);

    }

    // 재배치 종료 qr 코드 촬영
    if (this.props.step.status === 'RETURNING_BICYCLE') {
      const payload = {
        body: {
          status: 'D',
          is_done: true,
          latitude: Number.parseFloat(latitude).toFixed(8),
          longitude: Number.parseFloat(longitude).toFixed(8),
        },
        selectedTransfer,
        qrcode: data
      }

      await AsyncStorage.getItem('currentTransferId').then(id => {
        payload.id = parseInt(id);
      })

      await AsyncStorage.getItem('limitedTime').then(limitedTime => {
        const now = moment()
        if (now.diff(JSON.parse(limitedTime)) > 0) {
          payload.body.status = 'F'
          payload.body.is_done = false
        }

      })

      this.props.actions.fetchPatchTransfers(payload)

      this.setState({ scanned: true });
      await setTimeout(() => {
        this.setState({ scanned: false });
      }, 3000);
    }
  };

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  renderButton = () => {
    const text = '다시 스캔하기';
    const onPress = () => this.setState({ scanned: false });
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

  render() {
    const { hasCameraPermission, scanned, flashMode } = this.state;
    const { isFocused } = this.props;

    if (hasCameraPermission === null) {
      return <Text>카메라 권한을 주세요!</Text>;
    }

    if (hasCameraPermission === false) {
      return <Text>카메라 접근 권한이 없습니다.</Text>;
    }

    if (isFocused) {
      return (
        <View style={styles.container}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => this._flashOnOff(!this.state.flashMode)}>
              <View style={styles.modalIcon}>
                <Ionicons name="ios-flashlight" size={35} />
              </View>
            </TouchableOpacity>
            <Text style={styles.modalText}>QR코드를 촬영해주세요 📷 </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
              <View style={styles.modalIcon}>
                <Ionicons name="md-close" size={35} />
              </View>
            </TouchableOpacity>
          </View>
          <Camera
            flashMode={flashMode ? Camera.Constants.FlashMode.torch : undefined}
            onBarCodeScanned={scanned ? undefined : this._handleQRScanned}
            style={styles.camera}
          />

          {scanned && (
            this.renderButton()
          )}

          <Modal transparent={true} visible={this.state.modalVisible}>
            <View style={styles.messageView}>
              <View style={styles.cardView}>
                <Text style={styles.cardText}>{this.state.message1}</Text>
                <Text style={styles.cardText}>{this.state.message2}</Text>
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalView: {
    width,
    height: height * 0.1,
    elevation: 25,
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 15,
  },
  modalText: {
    color: '#4a4a4a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  camera: {
    width,
    height: height * 0.9
  },
  modalIcon: {
    paddingHorizontal: 5,
  },
  messageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardView: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: width - 40,
    height: height * 0.35,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: '2%',
    width: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0FD97E',
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: '#009000',
    borderWidth: 1.5
  },
  resetText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    step: state.step,
    loginedUser: state.auth.loginedUser,
    mapregion: state.mapregion
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(stepActions, dispatch)
  };
};

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(QR));
