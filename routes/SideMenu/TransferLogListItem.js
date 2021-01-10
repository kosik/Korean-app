import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default class TransferLogListItem extends Component {

  render() {
    const { transfer: { departure, arrival, created_at, updated_at, }, count, index } = this.props;
    const start_time = moment(created_at);
    const end_time = moment(updated_at);
    return (
      <View style={styles.mainContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{start_time.format('M.DD')}</Text>
          <Text style={styles.timeText}>{parseInt(moment.duration(end_time.diff(start_time)).asMinutes())}분</Text>
        </View>
        <View style={styles.iconContainer}>
          <View style={{ width: 12, height: 12, borderRadius: 10, backgroundColor: '#3c5665', justifyContent: 'center', alignItems: 'center', borderColor: '#2b414e', borderWidth: 0.5 }} >
            <View style={{ width: 4, height: 4, borderRadius: 10, backgroundColor: '#fff' }} />
          </View>
          <View style={{ width: 1, height: '40%', borderWidth: 2, borderColor: '#00d980' }} />
          <View style={{ width: 12, height: 12, borderRadius: 10, backgroundColor: '#00d980', justifyContent: 'center', alignItems: 'center', borderColor: '#00bf71', borderWidth: 0.5 }} >
            <View style={{ width: 4, height: 4, borderRadius: 10, backgroundColor: '#fff' }} />
          </View>
        </View>
        <View style={styles.stationContainer}>
          <Text style={styles.stationText} numberOfLines={1}>{departure}</Text>
          <Text style={[styles.stationText, { marginTop: 15 }]} numberOfLines={1}>{arrival}</Text>
        </View>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>+2,000원</Text>
          <Text style={styles.totalRewardText}>{(count - index) * 2},000원</Text>
        </View>

      </View>
    )

  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
    padding: 25,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  dateContainer: {
    padding: 5,
    marginTop: 5
  },
  dateText: {
    color: '#00596d',
    fontSize: 16,
    fontWeight: 'bold'
  },
  iconContainer: {
    padding: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationContainer: {
    flex: 1,
    padding: 5,
    marginTop: 5
  },
  stationText: {
    fontSize: 16,
    color: '#005a6f',

  },
  timeText: {
    fontSize: 16,
    color: '#ff8200',
    marginTop: 15
  },
  rewardContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rewardText: {
    fontWeight: 'bold',
    color: '#00e469',
    fontSize: 20
  },
  totalRewardText: {
    color: '#3c5665af',
    fontSize: 14,
    marginTop: 15
  }
})