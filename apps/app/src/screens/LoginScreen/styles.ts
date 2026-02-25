import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  googleButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1a6b3c',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
