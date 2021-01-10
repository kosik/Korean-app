import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window')

const Popup = ({ header, body, onPressConfirm, onPressNever }) => {
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.mainContainer}>
        {
          header &&
          <View style={styles.headerContainer}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{header}</Text>
          </View>
        }

        <View style={styles.bodyContainer}>
          <Text>{body}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={onPressNever}>
            <Ionicons name={'ios-checkmark-circle-outline'} size={20} color={'#fff'} />
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>다시 보지 않기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={onPressConfirm}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>닫기</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: '#0004',
    alignItems: 'center',
  },
  mainContainer: {
    position: 'absolute',
    width: width - 50,
    height: 200,
    bottom: height * 0.4,

    backgroundColor: '#fff',
    borderRadius: 5

  },

  headerContainer: {
    padding: 10,
  },

  bodyContainer: {
    padding: 20,
    flex: 1
  },
  buttonContainer: {
    borderTopWidth: 0.5,
    backgroundColor: '#00d97f',
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 20,
  },

  button: {
    padding: 10,
    paddingHorizontal: 20,
  }

})

export { Popup }