import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, BackHandler, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';

import Toast from '../../components/Toast';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth.action';

import RadioButtonGroup from '../../components/RadioButtonGroup';
import Input from '../../components/Input';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');

// 내 정보 페이지
class EditInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      name: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      isCertificationInput: false,
      certification_number: '',
      ages: '10',
      radio_index: 0
    }
  }

  checkPassword = password => {
    // 영문 숫자 혼합 4~12자
    let passwordExp = /^.*(?=.{4,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    return passwordExp.test(password)
  };

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    const { loginedUser } = this.props
    this.setState({ name: loginedUser.name, ages: loginedUser.ages, radio_index: loginedUser.ages / 10 - 1 })
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  editInfo = () => {

    const { name, phone_number, ages } = this.state
    const { isCertificate } = this.props

    const body = {
      name,
      ages
    }
    if (isCertificate) {
      body.phone_number = phone_number
    }

    this.props.actions.fetchPostEditInfo({ body })

  }

  certificatePhoneNumber = () => {
    const { phone_number } = this.state

    const body = {
      phone_number
    }

    this.props.actions.fetchCertificate({ body })
    this.setState({ isCertificationInput: true })

  }

  verifyCertificationNumber = () => {
    const { phone_number, certification_number } = this.state

    const body = {
      phone_number,
      certification_number
    }

    this.props.actions.fetchVerifyCertificateNumber({ body })
  }

  isSubmit = () => {
    const { isCertificate } = this.props
    if (this.state.name !== '' && this.state.phone_number == '') {
      return true
    }
    if (this.state.phone_number !== '' && this.props.isCertificate) {
      return true
    }
    return false
  }


  onPressRadioButton = (ages, radio_index) => {
    this.setState({ ages, radio_index })
  }

  render() {
    const { loginedUser, isCertificate, navigation } = this.props
    return (

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>

        <HeaderComponent
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => navigation.navigate('MyInfo') }}
          color={'#979797'}
        />
        <ScrollView contentContainerStyle={styles.inputContainer}>

          <View style={{ alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 26, marginHorizontal: 20, marginBottom: 40, color: '#3c5665' }}>내 정보 수정</Text>
          </View>

          <Input
            label={'이메일 주소'}
            onChangeText={email => this.setState({ email })}
            editable={false}
            value={loginedUser.email}
            placeholder={'이메일'}
            placeholderTextColor={'#adb7bd'}
          />

          <Input
            label={'닉네임'}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            placeholder={'활동할 닉네임을 입력해주세요'}
            placeholderTextColor={'#adb7bd'}
          />


          <View style={styles.input}>
            <View style={{ marginVertical: 5, alignSelf: 'flex-start' }}>
              <Text style={{ color: '#9aa5ac' }}>연령대</Text>
            </View>

            <RadioButtonGroup
              onPress={this.onPressRadioButton}
              formHorizontal={false}
              formStyle={{
                marginVertical: 10

              }}
              radioGroup={[
                { label: '10대', 'value': '10' },
                { label: '20대', 'value': '20' },
                { label: '30대', 'value': '30' },
                { label: '40대', 'value': '40' },
                { label: '50대', 'value': '50' },
                { label: '60대 이상', 'value': '60' },
              ]}
              labelHorizontal={false}
              radioIndex={this.state.radio_index}
            />
          </View>


          <View style={styles.phoneNumberContainer}>

            <Input
              label={'핸드폰 번호'}
              onChangeText={phone_number => this.setState({ phone_number })}
              value={this.state.phone_number}
              placeholder={'\'-\'를 제외한 숫자만 입력'}
              placeholderTextColor={'#adb7bd'}
              editable={!isCertificate}
              containerStyle={{ flex: 1 }}
              textInputStyle={{ width: '100%' }}
            />

            <TouchableOpacity onPress={() => this.certificatePhoneNumber()} disabled={this.state.phone_number == '' || isCertificate}>
              <View style={[styles.phoneNumberCertifcateButton, { backgroundColor: this.state.phone_number == '' || isCertificate ? '#aaa' : '#07D97F' }]}>
                <Text style={styles.submitText}>인증 번호 요청</Text>
              </View>
            </TouchableOpacity>
          </View>
          {
            this.state.isCertificationInput &&
            <View style={styles.phoneNumberContainer}>
              <Input
                label={'인증 번호'}
                onChangeText={certification_number => this.setState({ certification_number })}
                value={this.state.certification_number}
                placeholder={'인증번호를 입력해주세요.'}
                placeholderTextColor={'#adb7bd'}
                containerStyle={{ flex: 1 }}
                textInputStyle={{ width: '100%' }}
              />

              <TouchableOpacity onPress={() => this.verifyCertificationNumber()} disabled={this.state.certification_number == '' || isCertificate}>
                <View style={[styles.phoneNumberCertifcateButton, { backgroundColor: this.state.certification_number == '' || isCertificate ? '#aaa' : '#07D97F' }]}>
                  <Text style={styles.submitText}>인증</Text>
                </View>
              </TouchableOpacity>
            </View>
          }


          <Button
            title={'정보 변경'}
            onPress={() => this.editInfo()}
            disabled={!this.isSubmit()}
            buttonStyle={{ backgroundColor: this.isSubmit() ? '#07D97F' : '#aaa' }}
          />
        </ScrollView>

      </KeyboardAvoidingView>


    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
    padding: 20
  },
  profilePhoto: {
    backgroundColor: '#516173',
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    marginHorizontal: 10
  },
  userName: {
    fontSize: 22,
    color: '#4a4a4a',
    marginHorizontal: 10
  },
  infoContainer: {
    padding: 30
  },
  info: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 4,
    fontSize: 18,
    fontWeight: 'bold'
  },
  infoText: {
    flex: 6,
    marginLeft: 5
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
    alignItems: 'center',
    paddingVertical: 10
  },
  input: {
    width: width - 50,
    marginVertical: 5,
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
    alignItems: 'flex-end'
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
    marginBottom: 10
  }

})
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    loginedUser: state.auth.loginedUser,
    isCertificate: state.auth.isCertificate
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo)