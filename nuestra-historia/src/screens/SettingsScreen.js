import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { changePassword } from '../services/appLock';
import { useAuthGate } from '../context/AuthGateContext';

export default function SettingsScreen() {
  const { lock } = useAuthGate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    setError('');
    setMessage('');
    if (next.length < 4) return setError('La nueva contraseña debe tener al menos 4 caracteres');
    if (next !== confirm) return setError('La confirmación no coincide');
    setSaving(true);
    try {
      await changePassword(current, next);
      setMessage('Contraseña actualizada');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e) {
      setError(e.message || 'No se pudo cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ajustes</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña actual"
            placeholderTextColor={colors.tintaNoche + '77'}
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor={colors.tintaNoche + '77'}
            secureTextEntry
            value={next}
            onChangeText={setNext}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirma la nueva contraseña"
            placeholderTextColor={colors.tintaNoche + '77'}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {message ? <Text style={styles.success}>{message}</Text> : null}
          <PrimaryButton label="Guardar nueva contraseña" onPress={handleChange} loading={saving} />
        </View>

        <View style={styles.section}>
          <PrimaryButton label="Bloquear app ahora" onPress={lock} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.tintaNoche, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.tintaNoche, marginBottom: 10 },
  input: {
    backgroundColor: '#ffffffcc',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tintaNoche,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.humoLila + '66',
  },
  error: { fontFamily: fonts.bodySemi, color: '#B23A48', fontSize: 12, marginBottom: 8 },
  success: { fontFamily: fonts.bodySemi, color: '#3E7A55', fontSize: 12, marginBottom: 8 },
});
