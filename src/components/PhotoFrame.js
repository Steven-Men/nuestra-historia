import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PhotoFrame({ uri, size = 150, onPress, showClasp = true }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={{ width: size, height: size }}>
      <LinearGradient
        colors={[colors.cieloPastel, colors.rosaNube]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.border}
      >
        <View style={styles.inner}>
          <Image source={{ uri }} style={styles.image} />
        </View>
      </LinearGradient>
      {showClasp && (
        <View style={styles.clasp}>
          <Ionicons name="heart" size={14} color={colors.rosaNube} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  border: { flex: 1, borderRadius: 20, padding: 3 },
  inner: { flex: 1, borderRadius: 17, overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: '100%' },
  clasp: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
