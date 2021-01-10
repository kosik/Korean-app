import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, BackHandler, ImageBackground } from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';
import { bindActionCreators } from 'redux';

import * as bankActions from '../../actions/bank.action';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// 계좌 정보 페이지
class BankAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      account_type: '',
      account_number: ''
    }
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this.props.actions.fetchGetBank();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  registerAccount = () => {

    const { loginedUser, bank: { id, isRegistered } } = this.props
    const { account_type, account_number } = this.state
    if (account_type == '' && account_number == '') {
      return
    }
    const data = {
      method: isRegistered ? 'put' : 'post',
      path: isRegistered ? `/banks/${id}/` : '/banks/',
      payload: {
        user_id: loginedUser.id,
        account_type,
        account_number
      }
    }
    this.props.actions.fetchPostBank(data).then(() => {
      this.setModalVisible(!this.state.modalVisible);
    })
  }

  render() {
    const { bank: { isRegistered, account_type, account_number }, loginedUser } = this.props;
    return (
      <ImageBackground source={require('../../res/bankAccountBg.png')} style={{ width: '100%', height: '100%' }} resizeMode={'cover'}>
        <HeaderComponent
          headerText={'계좌 관리'}
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          backgroundColor={'#eff8f4'}
          color={'#3c5665'}
        />
        <View style={styles.mainContainer}>

          {isRegistered ?
            <View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>안녕하세요.</Text>
                <Text style={styles.infoText}>{loginedUser.name} 날러님!</Text>
              </View>
              <View style={[styles.cardContainer, { backgroundColor: '#facc15' }]}>
                <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={{ fontSize: 16, color: 'white' }}>{account_type}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', }}>
                  <Text style={{ fontSize: 30, color: 'white' }}>{account_number}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#ffffff58' }}>
                  <TouchableOpacity
                    onPress={() => { this.setModalVisible(true); }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, borderRightWidth: 1, borderColor: '#ffffff58' }}>
                    <Text style={{ fontSize: 16, color: '#fff' }}>계좌 변경하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                    <Text style={{ fontSize: 16, color: '#fff' }}>리워드 입금 내역</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>안녕하세요.</Text>
                <Text style={styles.infoText}>{loginedUser.name} 날러님!</Text>
              </View>
              <TouchableOpacity style={[styles.cardContainer, { backgroundColor: '#f9f9f9' }]}
                onPress={() => { this.setModalVisible(true); }}
              >
                <Text style={{ fontSize: 16, color: '#9b9b9b' }}>계좌를 등록하세요</Text>
                <View style={{ width: 50, height: 50, backgroundColor: '#f0f0f1', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                  <Ionicons name={'ios-add'} size={50} color={'#d8d8d8'} />
                </View>
              </TouchableOpacity>
            </View>
          }

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
          <View style={styles.addBankContainer}>

            <View style={{ alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 26, marginHorizontal: 20, marginBottom: 40, color: '#3c5665' }}>계좌 등록</Text>
            </View>

            <View style={styles.inputContainer}>


              <Input
                label={'은행 이름'}
                onChangeText={account_type => this.setState({ account_type })}
                value={this.state.account_type}
                placeholder={'은행 이름을 입력하세요'}
                placeholderTextColor={'#adb7bd'}
              />

              <Input
                label={'계좌 번호'}
                onChangeText={account_number => this.setState({ account_number })}
                value={this.state.account_number}
                placeholder={'계좌 번호을 입력하세요'}
                placeholderTextColor={'#adb7bd'}
              />
            </View>

            <Button
              title={'계좌 등록'}
              onPress={() => this.registerAccount()}
            />

          </View>
        </Modal>

      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    marginLeft: 30
  },
  infoText: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 5,
    marginHorizontal: 5,
    color: '#355767'
  },
  cardContainer: {
    height: 220,
    margin: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 110,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  changeAccountButton: {
    padding: 15,
    margin: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  addBankContainer: {
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

})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bankActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    loginedUser: state.auth.loginedUser,
    bank: state.bank
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankAccount)