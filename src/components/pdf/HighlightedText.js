import { View, Text } from '@react-pdf/renderer';
import React from 'react';

export default function HighlightedText({ children, backgroundColor }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
      }}
    >
      <Text>{children}</Text>
      <View
        style={{
          backgroundColor,
          position: 'absolute',
          left: -4,
          right: -5,
          top: 0,
          bottom: 0,
          zIndex: -1,
        }}
      ></View>
    </View>
  );
}
