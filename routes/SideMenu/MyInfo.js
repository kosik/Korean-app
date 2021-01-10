import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, BackHandler, Alert, Image, ScrollView, Switch } from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';

import Toast from '../../components/Toast';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth.action';
import * as userActions from '../../actions/user.action';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// 내 정보 페이지
class MyInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      name: '',
      phone_number: '',
      current_password: '',
      password: '',
      confirm_password: '',
      isCertificationInput: false,
      certification_number: '',
      isCheckPasswordError: false,
      isMatchPasswordError: false,
      isReceivePush: false,
      isReceiveSMS: false
    }
  }

  checkPassword = password => {
    // 영문 숫자 혼합 4~12자
    let passwordExp = /^.*(?=.{4,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    return passwordExp.test(password)
  };

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this.props.userActions.fetchGetUserDistance({ id: this.props.loginedUser.id })
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  changePassword = async () => {
    const { password, confirm_password, current_password } = this.state

    this.setState({ isCheckPasswordError: false, isMatchPasswordError: false })


    if (!this.checkPassword(password)) {
      this.setState({ isCheckPasswordError: true })
      return
    }



    if (password !== confirm_password) {
      this.setState({ isMatchPasswordError: true })
      return
    }
    const body = {
      current_password,
      new_password: password,
    }
    await this.props.authActions.fetchPostChangePassword({ body })
    if (this.props.changePasswordError == null) {
      this.setModalVisible(!this.state.modalVisible);
    }


  }

  isSubmit = () => {
    const { current_password, password, confirm_password } = this.state
    return current_password !== '' && password !== '' && confirm_password !== ''
  }


  render() {
    const { loginedUser, isCertificate, changePasswordError, loginedUserDistance } = this.props

    return (
      <ScrollView style={styles.container}>
        <HeaderComponent
          headerText={'내 정보 보기'}
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          backgroundColor={'#00d980'}
          color={'#ffffff'}
        />
        <View style={styles.profileContainer}>
          <Image source={require('../../res/imgUserBig.png')} style={{ width: 160, height: 160 }} />
          <View style={{ position: 'absolute', bottom: 100, right: 130, borderWidth: 2, borderColor: '#fff', backgroundColor: '#cad5db', borderRadius: 40, padding: 4 }}>
            <Feather name={'plus'} size={25} color={'#fff'} style={{ fontWeight: 'bold' }} />
          </View>

        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              닉네임
            </Text>
            <Text style={styles.infoText}>
              {loginedUser.name} 날러
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              핸드폰 번호
            </Text>
            <Text style={styles.infoText}>
              {loginedUser.phone_number}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              이메일 주소
            </Text>
            <Text style={styles.infoText}>
              {loginedUser.email}
            </Text>
          </View>


          <View style={[styles.infoContainer, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>
              연령대
            </Text>
            <Text style={styles.infoText}>
              {loginedUser.ages}대
            </Text>
          </View>

          {/* <View style={{
            padding: 25,
            borderBottomWidth: 1,
            borderColor: '#e4eeea'
          }}>
            <Text style={styles.infoLabel}>
              마케팅 정보 수신 동의
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
              <Text style={[styles.infoLabel, { color: '#3c5665', fontWeight: '400' }]}>
                푸시 수신 동의
            </Text>
              <Switch
                value={this.state.isReceivePush}
                onValueChange={(isReceivePush) => this.setState({ isReceivePush })}
                ios_backgroundColor={'#d8d8d8'}
                trackColor={{ false: '#d8d8d8', true: '#00d980' }}
              />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
              <Text style={[styles.infoLabel, { color: '#3c5665', fontWeight: '400' }]}>
                문자 수신 동의
            </Text>
              <Switch
                value={this.state.isReceiveSMS}
                onValueChange={(isReceiveSMS) => this.setState({ isReceiveSMS })}
                ios_backgroundColor={'#d8d8d8'}
                trackColor={{ false: '#d8d8d8', true: '#00d980' }}
              />
            </View>

          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              회원 탈퇴
            </Text>
          </View> */}

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Button
            title={'내 정보 수정'}
            onPress={() => { this.props.navigation.navigate('EditInfo') }}
            buttonStyle={styles.button}
          />
          <Button
            title={'비밀번호 변경'}
            onPress={() => { this.setModalVisible(true); }}
            buttonStyle={styles.button}
          />
        </View>






        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <HeaderComponent
            leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.setModalVisible(!this.state.modalVisible) }}
            color={'#979797'}
          />
          <View style={styles.editInfoContainer}>

            <View style={{ alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 26, marginHorizontal: 20, marginBottom: 40, color: '#3c5665' }}>비밀번호 변경</Text>
            </View>

            <View style={styles.inputContainer}>

              <Input
                label={'기존 비밀번호'}
                onChangeText={current_password => this.setState({ current_password })}
                value={this.state.current_password}
                placeholder={'기존 비밀번호를 입력하세요'}
                placeholderTextColor={'#adb7bd'}
                secureTextEntry={true}
                error={changePasswordError !== null && changePasswordError.current_password ? '현재 비밀번호가 틀립니다.' : null}
              />

              <Input
                label={'새 비밀번호'}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                placeholder={'새 비밀번호를 입력하세요'}
                placeholderTextColor={'#adb7bd'}
                secureTextEntry={true}
                error={this.state.isCheckPasswordError && '비밀번호는 영문,숫자를 혼합하여야 합니다.'}
              />

              <Input
                label={'새 비밀번호 확인'}
                onChangeText={confirm_password => this.setState({ confirm_password })}
                value={this.state.confirm_password}
                placeholder={'새 비밀번호를 다시 입력하세요'}
                placeholderTextColor={'#adb7bd'}
                secureTextEntry={true}
                error={this.state.isMatchPasswordError && '비밀번호가 다릅니다.'}
              />

            </View>

            <Button
              title={'비밀번호 변경'}
              onPress={() => this.changePassword()}
              disabled={!this.isSubmit()}
              buttonStyle={{ backgroundColor: this.isSubmit() ? '#07D97F' : '#aaa' }}
            />

          </View>
        </Modal>








      </ScrollView>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00d980',
    paddingTop: 60,
    paddingBottom: 100
  },
  profilePhoto: {
    backgroundColor: '#fff',
    height: 160,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },
  userName: {
    fontSize: 22,
    color: '#4a4a4a',
    marginHorizontal: 10
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 25,
    borderBottomWidth: 1,
    borderColor: '#e4eeea'
  },
  info: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
    fontSize: 18,
    color: '#3c5665a6'
  },
  infoText: {
    marginLeft: 5,
    alignSelf: 'flex-end',
    color: '#3c5665',
    fontSize: 18
  },
  editInfoButton: {
    padding: 15,
    margin: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07D97F',
  },
  editInfoContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 30
  },
  inputContainer: {
    flex: 1
  },
  input: {
    width: width - 40,
    padding: 10,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    marginVertical: 15,
  },
  submit: {
    width: width - 40,
    padding: 10,
    backgroundColor: '#07D97F',
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  phoneNumberContainer: {
    width: width - 40,
    flexDirection: 'row',
    marginVertical: 15,
  },
  phoneNumberText: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
  },
  phoneNumberCertifcateButton: {
    padding: 10,
    backgroundColor: '#07D97F',
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 12
  },
  button: {
    flex: 1,
    marginHorizontal: 10
  }

})
const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    loginedUser: state.auth.loginedUser,
    isCertificate: state.auth.isCertificate,
    changePasswordError: state.auth.changePasswordError,
    loginedUserDistance: state.user.loginedUserDistance
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyInfo)