import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// page header component
export default class HeaderComponent extends Component {
  render() {
    const { headerText, leftComponent, color, rightComponent, backgroundColor } = this.props;
    return (
      <View style={[styles.header, { backgroundColor }]}>
        {leftComponent
          ? <TouchableOpacity
            style={styles.modalIcon}
            onPress={() => leftComponent.onPress()}>
            <Ionicons name={leftComponent.icon} size={50} color={color} />
          </TouchableOpacity>
          : <View style={styles.modalIcon} />}

        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText, { color }]}>{headerText}</Text>
        </View>

        {rightComponent
          ? <TouchableOpacity
            style={styles.modalIcon}
            onPress={() => rightComponent.onPress()}>
            <Ionicons name={rightComponent.icon} size={30} color={color} />
          </TouchableOpacity>
          : <View style={styles.modalIcon} />}

      </View>
    )
  }
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  modalIcon: {
    width: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },


})