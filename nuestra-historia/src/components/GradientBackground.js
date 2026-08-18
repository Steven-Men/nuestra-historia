import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function GradientBackground({ children, style }) {
  return (
    <LinearGradient
      colors={[colors.papelAlgodon, '#EFE4F1', colors.cieloPastel + '40']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.fill, style]}
    >
      <View style={[styles.bokeh, styles.bokehBlue]} pointerEvents="none" />
      <View style={[styles.bokeh, styles.bokehRose]} pointerEvents="none" />
      <View style={[styles.bokeh, styles.bokehGold]} pointerEvents="none" />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  bokeh: { position: 'absolute', borderRadius: 999, opacity: 0.25 },
  bokehBlue: { width: 180, height: 180, backgroundColor: colors.cieloPastel, top: -40, right: -50 },
  bokehRose: { width: 140, height: 140, backgroundColor: colors.rosaNube, bottom: 90, left: -40 },
  bokehGold: { width: 90, height: 90, backgroundColor: colors.oroSuave, bottom: -20, right: 40 },
});
