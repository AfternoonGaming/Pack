import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { COLORS, SIZES } from '../theme/colors';

const API_BASE_URL = 'http://your-backend-api.com/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('⚠️  Fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      navigation.replace('Dashboard', { user: response.data.user, authToken: response.data.token });
    } catch (err) {
      setError(`❌ ${err.response?.data?.error || 'Login failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{'< MINECRAFT_SERVER_MANAGER />'}</Text>
        <Text style={styles.subtitle}>[HACKER MODE ACTIVATED]</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>&gt; EMAIL:</Text>
          <TextInput
            style={styles.input}
            placeholder="user@domain.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>&gt; PASSWORD:</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, styles.loginButton, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.neonGreen} />
          ) : (
            <>
              <Text style={styles.buttonPrefix}>[</Text>
              <Text style={styles.buttonText}>LOGIN</Text>
              <Text style={styles.buttonPrefix}>]</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerText}>[CREATE ACCOUNT]</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  titleContainer: {
    marginBottom: SIZES.xl * 2,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.neonCyan,
    textAlign: 'center',
    marginTop: SIZES.md,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  form: {
    backgroundColor: COLORS.darkPanel,
    borderRadius: 0,
    padding: SIZES.lg,
    borderWidth: 2,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputWrapper: {
    marginBottom: SIZES.lg,
  },
  label: {
    color: COLORS.neonCyan,
    fontSize: SIZES.sm,
    marginBottom: SIZES.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
    backgroundColor: COLORS.darkInput,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    marginBottom: 0,
    fontSize: SIZES.md,
    color: COLORS.textBright,
    fontFamily: 'monospace',
  },
  error: {
    color: COLORS.error,
    marginBottom: SIZES.md,
    fontSize: SIZES.sm,
    fontFamily: 'monospace',
  },
  button: {
    paddingVertical: SIZES.md,
    borderRadius: 0,
    alignItems: 'center',
    marginTop: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: COLORS.darkInput,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonPrefix: {
    color: COLORS.neonGreen,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    marginHorizontal: SIZES.sm,
  },
  buttonText: {
    color: COLORS.neonGreen,
    fontSize: SIZES.md,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  registerButton: {
    paddingVertical: SIZES.md,
    marginTop: SIZES.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neonCyan,
    borderRadius: 0,
  },
  registerText: {
    color: COLORS.neonCyan,
    fontSize: SIZES.md,
    fontWeight: '600',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});