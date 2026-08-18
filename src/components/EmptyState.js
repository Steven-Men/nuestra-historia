import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function EmptyState({ icon = 'heart-outline', title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={40} color={colors.rosaNube} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 30 },
  title: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.tintaNoche, marginTop: 10, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.tintaNoche + 'aa', marginTop: 4, textAlign: 'center' },
});
