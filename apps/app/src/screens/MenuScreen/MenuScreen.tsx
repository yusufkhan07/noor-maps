import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LoginScreen } from '../LoginScreen/LoginScreen';
import { t } from '../../app/translations';
import { styles } from './styles';

const T = t.menu;

export const MenuScreen = () => {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{T.title}</Text>

      <View style={styles.authSection}>
        <Text style={styles.signedInText}>
          {T.signedInAs}{' '}
          {user.email ?? (user.user_metadata?.full_name as string) ?? ''}
        </Text>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut} activeOpacity={0.8}>
          <Text style={styles.signOutButtonText}>{T.signOut}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
