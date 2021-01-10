import React from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const calcTimeFromDistance = (type, distance) => {
  switch (type) {
    case 'walk':
      return distance / 50
      break;

    case 'bicycle':
      return distance / 200
      break;

    default:
      break;
  }
}

const indexText = ['A', 'B', 'C', 'D', 'E']

function TransferCard({ transfer, index = null, isAlone = false }) {

  const totalTime = +transfer.departure.walkTime + +transfer.bicycleTime

  const { departure: { walkTime, distancefromCurrent }, linealDistance, bicycleTime, departure, arrival } = transfer

  const totalDistance = distancefromCurrent + linealDistance


  return <View style={styles.container}>
    <View style={{ marginTop: 10 }}>
      <Text style={{ color: '#00de76', fontWeight: 'bold' }}>가장 가까운 출발지</Text>
    </View>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        약 {Number.parseInt(totalTime)}분 소요, {Number.parseFloat(totalDistance / 1000).toFixed(1)}km
        </Text>
    </View>

    <View style={styles.pathContainer}>
      <View style={styles.stationTextContainer}>
        <Text numberOfLines={1} style={styles.pathText}>{departure.stationName}</Text>
      </View>

      <View style={styles.arrowIconContainer}>
        <Ionicons size={20} name="ios-play" color={'#00de76'} />
      </View>
      <View style={styles.stationTextContainer}>
        <Text numberOfLines={1} style={styles.pathText}>{arrival.stationName}</Text>
      </View>
    </View>
    <View style={styles.distanceContainer}>

      <Text style={styles.distancTimeText}>도보 {walkTime}분, {Number.parseFloat(distancefromCurrent / 1000).toFixed(1)}km / </Text>
      <Text style={styles.distancTimeText}>자전거 {bicycleTime}분, {Number.parseFloat(linealDistance / 1000).toFixed(1)}km </Text>

    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    borderRadius: 12,
    elevation: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    paddingHorizontal: 20,
    borderColor: '#00d980',
    borderWidth: 1
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3c5665'
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pathText: {
    fontSize: 16,
    color: '#3c5665'
  },
  stationTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  distancTimeText: {
    fontSize: 12,
    color: '#3c5665d8'
  },
  arrowIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  }
});

export default TransferCard;
