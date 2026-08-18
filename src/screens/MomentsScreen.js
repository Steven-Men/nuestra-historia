import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { listenToMoments, addMoment, captureCurrentLocation } from '../services/moments';

export default function MomentsScreen() {
  const [moments, setMoments] = useState([]);
  const [text, setText] = useState('');
  const [location, setLocation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const unsub = listenToMoments(setMoments);
    return unsub;
  }, []);

  const handleLocate = async () => {
    setLocating(true);
    try {
      const loc = await captureCurrentLocation();
      setLocation(loc);
    } catch (e) {
      // permiso denegado o error de ubicación
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim() && !location) return;
    setSaving(true);
    try {
      await addMoment({ text: text.trim(), location });
      setText('');
      setLocation(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientBackground>
      <Text style={styles.title}>Momentos</Text>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="¿Qué están viviendo hoy?"
          placeholderTextColor={colors.tintaNoche + '77'}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.locBtn} onPress={handleLocate} disabled={locating}>
          <Ionicons name="location" size={16} color={colors.tintaNoche} />
          <Text style={styles.locText} numberOfLines={1}>
            {locating ? 'Ubicando...' : location?.label || 'Añadir ubicación'}
          </Text>
        </TouchableOpacity>
        <PrimaryButton label="Guardar momento" onPress={handleSave} loading={saving} />
      </View>

      {moments.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Aún no hay momentos"
          subtitle="Registra sus recuerdos, ideas y planes"
        />
      ) : (
        <FlatList
          data={moments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.text ? <Text style={styles.cardText}>{item.text}</Text> : null}
              {item.location?.label ? (
                <View style={styles.cardLoc}>
                  <Ionicons name="location" size={12} color={colors.rosaNube} />
                  <Text style={styles.cardLocText}>{item.location.label}</Text>
                </View>
              ) : null}
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        />
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.tintaNoche, paddingHorizontal: 20, paddingTop: 16 },
  composer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 10 },
  input: {
    backgroundColor: '#ffffffcc',
    borderRadius: 14,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tintaNoche,
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.humoLila + '66',
  },
  locBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffffaa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  locText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.tintaNoche },
  card: { backgroundColor: '#ffffffbb', borderRadius: 14, padding: 14, marginTop: 10 },
  cardText: { fontFamily: fonts.body, fontSize: 14, color: colors.tintaNoche },
  cardLoc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  cardLocText: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.rosaNube },
  cardDate: { fontFamily: fonts.body, fontSize: 10, color: colors.tintaNoche + '88', marginTop: 6 },
});
