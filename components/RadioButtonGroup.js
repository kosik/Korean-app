import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import RadioForm, { RadioButtonInput, RadioButtonLabel, RadioButton } from 'react-native-simple-radio-button';


const { width, height } = Dimensions.get('window');

function radioButtonGroup(
  { formHorizontal = false,
    formStyle,
    radioGroup,
    onPress,
    labelHorizontal = true,
    radioIndex
  }
) {

  return (
    <RadioForm formHorizontal={formHorizontal} style={formStyle}>
      <View style={{ flexDirection: 'row' }}>


        {radioGroup.map((radio, i) => {
          if (i > 2) return
          return (
            <RadioButton key={i} labelHorizontal={labelHorizontal}>
              <RadioButtonLabel
                obj={radio}
                index={i}
                onPress={onPress}
              />
              <RadioButtonInput
                obj={radio}
                index={i}
                isSelected={radioIndex === i}
                onPress={onPress}
                borderWidth={1}
                buttonInnerColor={'#07D97F'}
                buttonOuterColor={'#777'}
                buttonSize={12}
                buttonOuterSize={20}
                buttonWrapStyle={{ marginHorizontal: width / 10, marginBottom: 10 }}
              />
            </RadioButton>
          )
        })}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {radioGroup.map((radio, i) => {
          if (i < 3) return
          return (
            <RadioButton key={i} labelHorizontal={labelHorizontal}>
              <RadioButtonLabel
                obj={radio}
                index={i}
                onPress={onPress}
              />
              <RadioButtonInput
                obj={radio}
                index={i}
                isSelected={radioIndex === i}
                onPress={onPress}
                borderWidth={1}
                buttonInnerColor={'#07D97F'}
                buttonOuterColor={'#777'}
                buttonSize={12}
                buttonOuterSize={20}
                buttonWrapStyle={{ marginHorizontal: width / 10 }}
              />
            </RadioButton>
          )
        })}
      </View>

    </RadioForm>
  )
}

export default radioButtonGroup
