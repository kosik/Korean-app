import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, BackHandler, Image } from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';
import TransferLogListItem from './TransferLogListItem';

import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/user.action';


// 리워드 및 재배치 작업 로그 표시
class Reward extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this.props.actions.fetchGetTransfers()
  };


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }


  render() {
    const { user: { transfer }, loginedUser } = this.props;
    return (
      <View style={styles.container}>
        <HeaderComponent
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          backgroundColor={'#eff8f4'}
          color={'#3c5665'}
        />
        <View style={styles.mainContainer}>
          <View style={styles.rewardContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, }}>
                <Text style={{ fontSize: 26, color: '#355767' }}>{loginedUser.name}날러님의</Text>
                <Text style={{ fontSize: 26, marginTop: 10, color: '#355767' }}>누적리워드</Text>
              </View>

              <Image source={require('../../res/imgUserBig_reversal.png')} style={{ width: 70, height: 70 }} />

            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 42, color: '#005a6f', fontWeight: 'bold' }}>{transfer.count == 0 ? `0원` : `${transfer.count * 2},000원`}</Text>
            </View>
          </View>
          <FlatList
            data={transfer.results}
            keyExtractor={(item, index) => `${item.id}`}
            renderItem={({ index, item }) => {
              return item.is_done ? <TransferLogListItem index={index} transfer={item} count={transfer.count} /> : null
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1
  },
  rewardContainer: {
    padding: 40,
    backgroundColor: '#eff8f4',
    paddingTop: 0,

  },
  rewardText: {
    fontSize: 28,
    fontWeight: 'bold',


  },
  withdrawalButton: {
    marginVertical: 15,
    backgroundColor: '#0FD97E',
    padding: 15,
    paddingHorizontal: 80,
    borderRadius: 10
  },
  withdrawalText: {
    fontSize: 16,
    color: '#fff'
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginedUser: state.auth.loginedUser
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reward)