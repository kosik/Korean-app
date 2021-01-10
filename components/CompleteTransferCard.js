import React from 'react';
import { Dimensions, Text, View, StyleSheet, Image, ImageBackground } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');



const indexText = ['A', 'B', 'C', 'D', 'E']

function CompleteTransferCard() {



  return <View style={styles.container}>
    <Image source={require('../res/reward2000.png')}
      resizeMode={'cover'}
      style={{ width: '100%', borderColor: '#000', borderRadius: 20 }} />
  </View>

}

const styles = StyleSheet.create({

  container: {
    width: width,
    flexDirection: 'column',
    position: 'absolute',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    bottom: '6.5%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
  },

});

export default CompleteTransferCard;
