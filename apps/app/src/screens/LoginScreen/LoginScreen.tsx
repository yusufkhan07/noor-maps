import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../app/translations';
import { styles } from './styles';

const T = t.login;

export const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch {
      Alert.alert(T.errorTitle, T.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{T.title}</Text>
      <Text style={styles.subtitle}>{T.subtitle}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogle}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.googleButtonText}>{T.continueWithGoogle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
