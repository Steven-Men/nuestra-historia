import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { getLockStatus, setupPassword, verifyPassword } from '../services/appLock';
import { useAuthGate } from '../context/AuthGateContext';

export default function LockScreen() {
  const { unlock } = useAuthGate();
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLockStatus()
      .then((status) => setConfigured(status.configured))
      .catch(() => setError('No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.'))
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!configured) {
      if (password.length < 4) return setError('Usa al menos 4 caracteres');
      if (password !== confirm) return setError('Las contraseñas no coinciden');
      setLoading(true);
      try {
        await setupPassword(password);
        unlock();
      } catch (e) {
        setError('No se pudo guardar la contraseña');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const ok = await verifyPassword(password);
      if (ok) unlock();
      else setError('Contraseña incorrecta');
    } catch (e) {
      setError('No pudimos verificar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <GradientBackground style={styles.center}>
        <ActivityIndicator color={colors.rosaNube} />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}
      >
        <Ionicons name="heart" size={44} color={colors.rosaNube} />
        <Text style={styles.title}>Nuestra Historia</Text>
        <Text style={styles.subtitle}>
          {configured
            ? 'Ingresa tu contraseña para entrar'
            : 'Crea una contraseña para proteger la app'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.tintaNoche + '77'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {!configured && (
          <TextInput
            style={styles.input}
            placeholder="Confirma tu contraseña"
            placeholderTextColor={colors.tintaNoche + '77'}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ height: 10 }} />
        <PrimaryButton
          label={configured ? 'Entrar' : 'Guardar contraseña'}
          onPress={handleSubmit}
          loading={loading}
        />
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.tintaNoche, marginTop: 10 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.tintaNoche + 'aa',
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffffcc',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tintaNoche,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.humoLila + '66',
  },
  error: { fontFamily: fonts.bodySemi, color: '#B23A48', fontSize: 13, marginTop: 4 },
});
