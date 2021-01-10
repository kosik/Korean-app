import React, { Component } from 'react';

import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';


// fetch indicator component
export default class FetchIndicator extends Component {
  render() {
    return this.props.isFetching ? (
      <View style={[styles.container, this.props.centerIndicator ? styles.centerIndicator : null]}>
        <ActivityIndicator size="large" color={'rebeccapurple'} />
        <Text style={styles.infoText}>{this.props.infoText}</Text>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  centerIndicator: {
    backgroundColor: '#fff5',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginTop: 0,
  },
  infoText: {
    marginTop: 20,
  },
});
