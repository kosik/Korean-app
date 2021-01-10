import React from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground, Platform } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../../actions/auth.action';
import * as userActions from '../../actions/user.action';


class SideMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      TopList: [
        {
          title: '내 정보',
          onPress: () => this.props.navigation.navigate('MyInfo'),
          imageUri: require('../../res/icoInfoEdit.png')
        },
        {
          title: '계좌 관리',
          onPress: () => this.props.navigation.navigate('BankAccount'),
          imageUri: require('../../res/icoAccount.png')
        },
      ],
      mainList: [

        {
          title: '누적 리워드(원) >',
          value: '-',
          onPress: () => this.props.navigation.navigate('Reward'),
          imageUri: require('../../res/sidemenu-reward.png')
        },
        {
          title: '나의 랭킹 >',
          value: '-',
          onPress: () => this.props.navigation.navigate('Ranking'),
          imageUri: require('../../res/icoRanking.png')
        },
        {
          title: '누적 탄소 절감 (kg) >',
          value: '-',
          onPress: null,
          imageUri: require('../../res/sidemenu-carbon.png')
        },
        {
          title: '누적 주행거리(km) >',
          value: props.user.loginedUserDistance,
          onPress: null,
          imageUri: require('../../res/sidemenu-distance.png')
        },
      ]
    }
  }

  onPressLogout = () => {
    Alert.alert('Logout', '로그아웃하시겠습니까?', [
      { text: '예', onPress: () => this.props.authActions.fetchLogout() },
      { text: '아니오' }
    ])
  }


  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.user !== this.props.user) {
      const { loginedUser, user: { loginedUserRank, loginedUserDistance, transfer } } = this.props
      this.setState({
        TopList: [
          {
            title: '내 정보',
            onPress: () => this.props.navigation.navigate('MyInfo'),
            imageUri: require('../../res/icoInfoEdit.png')
          },
          {
            title: '계좌 관리',
            onPress: () => this.props.navigation.navigate('BankAccount'),
            imageUri: require('../../res/icoAccount.png')
          },
        ],
        mainList: [

          {
            title: '누적 리워드(원) >',
            value: transfer.count == 0 ? `0` : `${transfer.count * 2},000`,
            onPress: () => this.props.navigation.navigate('Reward'),
            imageUri: require('../../res/sidemenu-reward.png')
          },
          {
            title: '나의 랭킹 >',
            value: `${loginedUserRank}위`,
            onPress: () => this.props.navigation.navigate('Ranking'),
            imageUri: require('../../res/icoRanking.png')
          },
          {
            title: '누적 탄소 절감 (kg) >',
            value: Number.parseFloat(0.232 * loginedUserDistance).toFixed(2),
            onPress: null,
            imageUri: require('../../res/sidemenu-carbon.png')
          },
          {
            title: '누적 주행거리(km) >',
            value: loginedUserDistance,
            onPress: null,
            imageUri: require('../../res/sidemenu-distance.png')
          },
        ]
      })
    }

  }

  render() {
    const { mainList, TopList } = this.state
    const { loginedUser, user: { loginedUserRank, loginedUserDistance, transfer } } = this.props

    return (
      <ImageBackground source={require('../../res/sideBarBg.png')} style={{ width: '100%', height: '100%' }} resizeMode={'cover'}>
        <View style={styles.profileView}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{loginedUser.name}</Text>
            <TouchableOpacity onPress={() => this.onPressLogout()}>
              <Text style={{ marginTop: 10, color: '#9b9b9b', fontSize: 16 }}>로그아웃 ></Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profilePhoto}>
            <Image source={require('../../res/imgUserBig_reversal.png')} style={{ width: 70, height: 70 }} />
          </View>

        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 25 }}>
          {
            TopList.map((menu, index) => {
              return (
                <TouchableOpacity key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={menu.onPress}>
                  <Image source={menu.imageUri} style={{ width: 40, height: 40 }} />
                  <Text style={{ fontSize: 20, color: '#3c5665' }}>
                    {menu.title}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
        <ScrollView contentContainerStyle={styles.routeListView}>
          {mainList.map((menu, index) => {
            return (
              <TouchableOpacity key={index} style={[styles.listItemView, menu.onPress == null && styles.nonClickMenu]} onPress={menu.onPress} disabled={menu.onPress == null}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listText}>
                    {menu.title}
                  </Text>
                  <Text style={{ fontSize: 36, color: '#3c5665', marginTop: 5 }}>
                    {menu.value}
                  </Text>
                </View>

                <View>
                  <Image source={menu.imageUri} style={{ width: 90, height: 90 }} />
                </View>

              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff8f4'
  },
  profileView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
    flexDirection: 'row',
    borderBottomWidth: 1.0,
    borderColor: '#e4eeea'
  },
  profilePhoto: {
    backgroundColor: '#00d980',
    marginBottom: 0,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  profilePhotoText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    color: '#4a4a4a',
    marginTop: 10
  },
  routeListView: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  listItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  listGreyButton: {
    height: 15,
    width: 15,
    borderRadius: 50,
    backgroundColor: '#ededed',
  },
  listText: {
    fontSize: 15,
    color: '#3c5665a6',
  },
  bikeImage: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    width: 72,
    height: 72,
  },
  nonClickMenu: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,

    elevation: 1,
  }
});


const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  }
}

const mapStateToProps = (state) => {
  return {
    access: state.auth.access,
    refresh: state.auth.refresh,
    loginedUser: state.auth.loginedUser,
    user: state.user,

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)