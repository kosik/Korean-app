import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions
  , TextInput
} from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth.action';
import Toast from 'react-native-root-toast';
import FetchIndicator from '../../components/FetchIndicator';

import Input from '../../components/Input';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');


// 번호 인증 페이지
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certification_number: '',
      inputError: null,
    }
  }

  componentDidMount = () => {
    this.showToastMessage('문자 메시지로 인증번호가 전송됩니다.')
  };

  showToastMessage = (message) => {
    this.toast = Toast.show(message, {
      duration: 2000,
      position: -150,
      onPress: () => {
        alert('You clicked me!')
      },
      onHidden: () => {
        this.toast.destroy();
        this.toast = null;
      }
    });
  };

  onPressPhoneAuth = () => {
    const { phone_number, email } = this.props.auth
    const { certification_number } = this.state
    if (certification_number.trim().length !== 6) {
      this.setState({ inputError: '인증번호는 6자입니다.' })
      return
    }
    payload = {
      email,
      phone_number,
      certification_number
    }
    this.props.actions.fetchPostUserActivation(payload)
  }

  render() {
    const { isAuthLoading, error } = this.props.auth
    const { inputError } = this.state
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>

        <HeaderComponent
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          color={'#979797'}
        />
        <View style={{ alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 26, marginHorizontal: 20, marginBottom: 20, color: '#3c5665' }}>핸드폰 번호 인증</Text>
        </View>
        <View style={styles.mainContainer}>

          <View style={styles.inputContainer}>
            <View style={{
              width: width - 40,
              flexDirection: 'row',
              marginVertical: 15,
              alignItems: 'flex-end'
            }}>
              <Input
                label={'인증번호'}
                onChangeText={certification_number => this.setState({ certification_number })}
                value={this.state.phoneNumber}
                placeholder={'인증번호를 입력해주세요.'}
                placeholderTextColor={'#adb7bd'}
                error={inputError ? inputError : error !== null && error.non_field_errors ? '인증번호가 다릅니다.' : null}
                containerStyle={{ flex: 1 }}
                textInputStyle={{ width: '100%' }}
              />
            </View>

          </View>

          <Button
            title={'확인'}
            onPress={() => this.onPressPhoneAuth()}
          />

        </View>
        <FetchIndicator
          isFetching={isAuthLoading}
          centerIndicator
          infoText={'번호 인증중입니다...'}
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
  errorMessage: {
    color: 'red',
    fontSize: 12
  },

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