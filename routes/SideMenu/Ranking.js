import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, BackHandler, Image } from 'react-native';

import HeaderComponent from '../../components/HeaderComponent';
import RankingListItem from './RankingListItem';


import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/user.action';


// 랭킹 페이지
class Ranking extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this.props.actions.fetchGetRank({ id: this.props.loginedUser.id });

  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }


  render() {
    const { user: { ranking, loginedUserRank, loginedUserRankingInfo }, loginedUser } = this.props
    return (
      <View style={styles.container}>
        <HeaderComponent
          headerText={'누적 랭킹'}
          leftComponent={{ icon: 'ios-arrow-back', onPress: () => this.props.navigation.goBack() }}
          backgroundColor={'#00d980'}
          color={'#ffffff'}
        />
        <View style={styles.mainContainer}>
          <View style={styles.rankInfoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>나의 랭킹</Text>
                <Text style={{ fontSize: 34, marginTop: 20, color: '#fff' }}>{loginedUserRank}위</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../../res/imgUserBig.png')} style={{ width: 100, height: 100 }} />
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>누적 횟수</Text>
                <Text style={{ fontSize: 34, marginTop: 20, color: '#fff' }}>{loginedUserRankingInfo && loginedUserRankingInfo.rank}회</Text>
              </View>
            </View>

            <Text style={styles.rankInfoText}>{loginedUser.name}</Text>
          </View>

          <FlatList
            data={ranking}
            keyExtractor={(item, index) => `${item.user_id}`}
            renderItem={({ index, item }) => {
              return <RankingListItem user={item} index={index} />
            }}
          />
        </View>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  rankInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#00d980',
  },
  rankInfoText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#fff'
  },
  rankHeaderContainer: {
    padding: 10,
    marginVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  rankHeaderText: {
    fontSize: 20,
    color: '#ddd',
    marginLeft: 5
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
    loginedUser: state.auth.loginedUser,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Ranking)