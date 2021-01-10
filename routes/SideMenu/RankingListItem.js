import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default class RankingListItem extends Component {



  renderMedalIcon() {
    const imageSize = { width: 40, height: 40 }
    const { width, height } = imageSize
    switch (this.props.index) {
      case 0:
        return <Image source={require('../../res/icoMedal1.png')} style={{ width, height }} />
        break;

      case 1:
        return <Image source={require('../../res/icoMedal2.png')} style={{ width, height }} />
        break;

      case 2:
        return <Image source={require('../../res/icoMedal3.png')} style={{ width, height }} />
        break;

      default:
        break;
    }
  }

  render() {
    const { user, rank } = this.props.user;

    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.props.index <= 2
            ? this.renderMedalIcon()
            : <Text style={{ color: '#798d98', fontSize: 18, fontWeight: 'bold' }}>{this.props.index + 1}</Text>}
        </View>
        <View style={{ flex: 10, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, borderBottomWidth: 1, borderColor: '#e4eeea', paddingVertical: 15 }}>
          <Image source={require('../../res/imgUserBig.png')} style={{ width: 70, height: 70 }} />
          <Text style={styles.userText}>{user.name}</Text>
          <Text style={styles.rankText}>{rank}회</Text>
        </View>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginLeft: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 0,

  },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    borderRadius: 70
  },
  userText: {
    marginLeft: 30,
    fontSize: 20,
    color: '#3c5665',
    flex: 1,
  },
  rankText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#00d980',
  }
})