import React from 'react';
import { Dimensions, Text, View, StyleSheet, Image } from 'react-native';

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

function TransferDataCard({ transfer, index = null, isAlone = false }) {

  const totalTime = +transfer.departure.walkTime + +transfer.bicycleTime

  const { departure: { walkTime, distancefromCurrent }, linealDistance, bicycleTime, departure, arrival } = transfer

  const totalDistance = distancefromCurrent + linealDistance

  return <View style={styles.container}>
    <View style={styles.headerLabelContainer}>
      <Text style={styles.headerLabel}>가장 가까운 출발지</Text>
    </View>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        약 {Number.parseInt(totalTime)}분 소요, {Number.parseFloat(totalDistance / 1000).toFixed(1)}km
        </Text>
    </View>
    <View>
      <View style={styles.mainContainer}>
        <View style={{ flex: 1, alignItems: 'flex-end', }}>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginTop: 10 }}>
            <Image source={require('../res/icon_Man.png')}></Image>
            <View style={{ marginLeft: 10, alignItems: 'flex-end' }}>
              <Text>{walkTime}분,</Text>
              <Text>{Number.parseFloat(distancefromCurrent / 1000).toFixed(1)}km</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../res/icon_Bike.png')}></Image>
            <View style={{ marginLeft: 10, alignItems: 'flex-end' }}>
              <Text>{bicycleTime}분,</Text>
              <Text>{Number.parseFloat(linealDistance / 1000).toFixed(1)}km</Text>
            </View>
          </View>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ff8200', justifyContent: 'center', alignItems: 'center', borderColor: '#cd8539', borderWidth: 0.5 }} >
          </View>
          <View style={{ width: 1, height: '20%', borderWidth: 2, borderColor: '#c5cddf' }} />
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#3c5665', justifyContent: 'center', alignItems: 'center', borderColor: '#2b414e', borderWidth: 0.5 }} >
            <View style={{ width: 4, height: 4, borderRadius: 10, backgroundColor: '#fff' }} />
          </View>
          <View style={{ width: 1, height: '35%', borderWidth: 2, borderColor: '#00d980' }} />
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#00d980', justifyContent: 'center', alignItems: 'center', borderColor: '#00bf71', borderWidth: 0.5 }} >
            <View style={{ width: 4, height: 4, borderRadius: 10, backgroundColor: '#fff' }} />
          </View>
        </View>

        <View style={{ flex: 3 }}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>출발지까지 걷기</Text>
          </View>
          <View style={[styles.infoContainer, { borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#e1e6f0' }]}>
            <Text style={styles.infoText}>{departure.stationName}</Text>
            <View style={styles.stationInfoContainer}>
              <View style={styles.stockIcon}><Text style={{ fontSize: 12, color: '#83939d' }}>재고</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 12 }}>
                <Text style={{ fontSize: 16, color: '#00b655' }}>{departure.parkingBikeTotCnt}</Text>
                <Text style={{ fontSize: 16, color: '#83939d' }}>  / {departure.rackTotCnt} 대</Text>
              </View>
            </View>

          </View>
          <View style={[styles.infoContainer, { paddingBottom: 0 }]}>
            <Text style={styles.infoText}>{arrival.stationName}</Text>
            <View style={styles.stationInfoContainer}>
              <View style={styles.stockIcon}><Text style={{ fontSize: 12, color: '#83939d' }}>재고</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 12 }}>
                <Text style={{ fontSize: 16, color: '#e80000' }}>{arrival.parkingBikeTotCnt}</Text>
                <Text style={{ fontSize: 16, color: '#83939d' }}>  / {arrival.rackTotCnt} 대</Text>
              </View>

            </View>
          </View>
        </View>
      </View>
    </View>
  </View>

}

const styles = StyleSheet.create({
  headerLabelContainer: {
    marginTop: 15,
    paddingHorizontal: 20
  },
  headerLabel: {
    color: '#00de76',
    fontWeight: 'bold'
  },
  container: {
    width: width,
    flexDirection: 'column',
    position: 'absolute',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    bottom: '6.5%',
    borderRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: -5,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 5,
    padding: 5,
    paddingHorizontal: 20,

  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3c5665'
  },
  mainContainer: {
    marginVertical: 10,
    borderTopWidth: 1.5,
    borderColor: '#e1e6f0',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  infoContainer: {
    paddingVertical: 20,
    justifyContent: 'center'
  },
  infoText: {
    fontSize: 18,
    color: '#3c5665'
  },
  stationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  stockIcon: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#bfcbd1',
    padding: 3,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',

  }

});

export default TransferDataCard;
