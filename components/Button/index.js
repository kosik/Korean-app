import React from 'react';
import { Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

function Button({
  title,
  onPress,
  isInvert = false,
  buttonStyle = {},
  disabled
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, isInvert && styles.invertButton, buttonStyle]} disabled={disabled}>
      <Text style={[styles.text, isInvert && styles.invertText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width - 60,
    paddingVertical: 18,
    backgroundColor: '#07D97F',
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  invertButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00d980'
  },
  invertText: {
    color: '#00d980',
    fontWeight: '400'
  }
});

export default Button;
