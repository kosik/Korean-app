import React, { Component, useState } from 'react';
import { Text, TextInput, StyleSheet, View, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const Input = ({
  label,
  value,
  placeholder,
  placeholderTextColor,
  onChangeText,
  textInputStyle,
  error,
  containerStyle = {},
  ...props
}) => {
  const [isFocusInput, setIsFocusInput] = useState(false)
  return (
    <View style={containerStyle}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, textInputStyle, { borderColor: isFocusInput ? '#00d980' : error ? '#ef4646' : '#dbe3e7' }]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => { setIsFocusInput(true) }}
        onBlur={() => { setIsFocusInput(false) }}
      />
      {
        error
          ?
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Feather name={'alert-circle'} size={20} color={'#ef4646'} />
            <Text style={styles.errorMessage}>
              {error}
            </Text>
          </View>
          : null
      }

    </View>
  )
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  inputLabel: {
    color: '#9aa5ac',
    marginBottom: 5,
    marginTop: 10
  },
  input: {
    width: width - 50,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#dbe3e7',
    fontSize: 18,
    marginBottom: 10
  },
  errorMessage: {
    color: '#ef4646',
    fontSize: 12,
    marginLeft: 5
  },

})

export default Input 