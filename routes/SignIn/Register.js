import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions
  , TextInput, ScrollView
} from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth.action';

import FetchIndicator from '../../components/FetchIndicator';
import Toast from '../../components/Toast';

import RadioButtonGroup from '../../components/RadioButtonGroup';
import Input from '../../components/Input';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');

// 회원가입 페이지
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirm_password: '',
      name: '',
      phone_number: '',
      ages: '10',
      radio_index: 0,
      inputError: {
        email: null,
        password: null,
        confirm_password: null,
      }
    }
  }

  checkEmail = email => {
    let emailExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;//이메일 정규식

    return emailExp.test(email)
  }

  checkPassword = password => {
    // 영문 숫자 혼합 4~12자
    let passwordExp = /^.*(?=.{4,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    return passwordExp.test(password)
  };

  onPressRegister = () => {
    const { error } = this.props.auth
    const { phone_number, password, confirm_password, name, email } = this.state;
    if (phone_number == '' || password == '' || confirm_password == '' || name == '' || email == '') {
      Toast.showToastMessage('빈 칸을 모두 입력해주세요.')
      return
    }

    if (!this.checkEmail(email)) {
      this.setState({ inputError: { ...this.state.inputError, email: '이메일 형식에 맞지 않습니다.' } })
      return
    }

    if (!this.checkPassword(password)) {
      this.setState({ inputError: { ...this.state.password, password: '비밀번호는 영문,숫자를 혼합하여야 합니다.' } })
      return
    }

    if (password !== confirm_password) {
      this.setState({ inputError: { ...this.state.password, confirm_password: '비밀번호가 다릅니다.' } })
      return
    }

    this.setState({ inputError: { email: null, password: null, confirm_password: null, } })

    this.props.actions.fetchCreateUser(this.state)

  }

  onPressRadioButton = (ages, radio_index) => {
    this.setState({ ages, radio_index })
  }

  render() {
    const { isAuthLoading, error } = this.props.auth
    const { inputError } = this.state
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <HeaderComponent
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          color={'#979797'}
        />


        <ScrollView
          contentContainerStyle={styles.mainContainer}>

          <View style={{ alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 26, marginHorizontal: 20, marginBottom: 40, color: '#3c5665' }}>회원가입</Text>
          </View>
          <Input
            label={'이메일 주소'}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            placeholder={'이메일'}
            placeholderTextColor={'#adb7bd'}
            error={inputError.email ? inputError.email : error !== null && error.email ? '이미 가입한 이메일입니다.' : null}
          />

          <Input
            label={'비밀번호'}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            placeholder={'영문, 숫자 조합 6~14자리'}
            placeholderTextColor={'#adb7bd'}
            secureTextEntry={true}
            error={inputError.password ? inputError.password : error !== null && error.password ? error.password[0] : null}
          />

          <Input
            label={'비밀번호 확인'}
            onChangeText={confirm_password => this.setState({ confirm_password })}
            value={this.state.confirm_password}
            placeholder={'비밀번호 확인'}
            placeholderTextColor={'#adb7bd'}
            secureTextEntry={true}
            error={inputError.confirm_password ? inputError.confirm_password : error !== null && error.password ? error.password[0] : null}
          />

          <Input
            label={'핸드폰 번호'}
            onChangeText={phone_number => this.setState({ phone_number })}
            value={this.state.phone_number}
            placeholder={'\'-\'를 제외한 숫자만 입력'}
            placeholderTextColor={'#adb7bd'}
            error={error !== null && error.phone_number ? error.phone_number[0] : null}
          />

          <Input
            label={'닉네임'}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            placeholder={'활동할 닉네임을 입력해주세요'}
            placeholderTextColor={'#adb7bd'}
            error={error !== null && error.name ? error.name[0] : null}
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

          <Button
            title={'핸드폰 번호 인증하기'}
            onPress={() => this.onPressRegister()}
          />

        </ScrollView>
        <FetchIndicator
          isFetching={isAuthLoading}
          centerIndicator
          infoText={'회원 가입중입니다....'}
        />


      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  inputContainer: {
  },
  input: {
    width: width - 50,
    marginVertical: 5,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12
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
  radioScrollView: {

  }


})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    error: state.auth.error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)