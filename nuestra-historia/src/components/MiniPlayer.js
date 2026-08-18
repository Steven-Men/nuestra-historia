import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../context/AudioContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function MiniPlayer() {
  const { current, isPlaying, toggle, progress, duration } = useAudio();
  if (!current) return null;

  const pct = duration ? Math.min(progress / duration, 1) : 0;

  return (
    <LinearGradient
      colors={[colors.rosaNube, colors.cieloPastel]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.wrap}
    >
      <TouchableOpacity onPress={toggle} style={styles.playBtn}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color={colors.tintaNoche} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.title}>
          {current.title}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fillBar, { width: `${pct * 100}%` }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  playBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bodyBold, color: '#fff', fontSize: 13 },
  track: { height: 3, backgroundColor: '#ffffff55', borderRadius: 2, marginTop: 4 },
  fillBar: { height: 3, backgroundColor: '#fff', borderRadius: 2 },
});
