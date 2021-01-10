import React from 'react';
import {
  Alert,
  CheckBox,
  Text,
  Dimensions,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  AsyncStorage
} from 'react-native';

import FetchIndicator from '../../components/FetchIndicator';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../../actions/auth.action';

import Input from '../../components/Input';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

class SignIn extends React.Component {
  state = {
    email: '',
    password: '',
    autoSignIn: false,
  };

  checkEmail = email => {
    let emailExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;//이메일 정규식

    return emailExp.test(email)
  }

  checkPassword = password => {
    // 영문 숫자 혼합 4~12자
    let passwordExp = /^.*(?=.{4,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    return passwordExp.test(password)
  };

  _login = () => {
    const { email, password } = this.state
    if (!this.checkEmail(email)) {
      Alert.alert('아이디 오류', '이메일 형식에 맞지 않습니다.');
    }
    else if (!this.checkPassword(password)) {
      Alert.alert('패스워드 오류', '영문, 숫자 혼합하여 4~12자 이내, 특수문자 쓰지 마세요');
    }
    else {
      // 로그인 완료 후 유저 정보 가져오기
      this.props.actions.fetchLogin({ email, password }).then(() => {
        this.props.actions.fetchGetUser();
      })

    }
  };

  // refresh 토큰이 있을 경우 해당 토큰을 이용해 자동 로그인
  autoLogin = () => {
    AsyncStorage.getItem('refresh').then(refresh => {
      if (refresh) {
        this.props.actions.fetchRefreshToken({ refresh }).then(() => {

        })
      }
    })
  }

  componentDidMount = () => {
    this.autoLogin()

  };

  render() {
    const { isAuthLoading } = this.props.auth
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : 'position'}>

        <View style={[styles.subContainer, { justifyContent: 'flex-end' }]}>
          <Image style={styles.logo} source={require('../../res/logo(275).png')} />
        </View>

        <View style={[styles.subContainer, { alignItems: 'flex-start', flex: 2 }]}>
          <Input
            label={'이메일'}
            value={this.state.email}
            placeholder={'이메일'}
            placeholderTextColor={'#adb7bd'}
            onChangeText={text => this.setState({ email: text })}
          />

          <Input
            label={'비밀번호'}
            value={this.state.password}
            placeholder={'영문, 숫자 조합 6~14자리'}
            placeholderTextColor={'#adb7bd'}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
            textInputStyle={{ marginBottom: 15 }}
          />

          {/* <View style={{ alignSelf: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: '#9aa5ac' }}>비밀번호 찾기</Text>
          </View> */}


        </View>

        <View style={styles.subContainer}>
          <Button
            title={'로그인'}
            onPress={() => this._login()}
          />

          <Button
            title={'회원가입'}
            onPress={() => this.props.navigation.navigate('Register')}
            isInvert={true}
          />


        </View>


        <FetchIndicator
          isFetching={isAuthLoading}
          centerIndicator
          infoText={'로그인하는 중입니다...'}
        />

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 80,
  },
  inputLabel: {
    color: '#9aa5ac',
    marginBottom: 5
  },
  input: {
    width: width - 50,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#00d980',
    fontSize: 18,
    marginBottom: 40
  },
  autoSingInView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoSignInText: {
    color: '#3B5462',
  },
  submit: {
    width: width - 60,
    paddingVertical: 18,
    backgroundColor: '#07D97F',
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    access: state.auth.access,
    refresh: state.auth.refresh,

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)