import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  favButton: {
    padding: 4,
  },
  favIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  favIconActive: {
    color: '#e63946',
  },
});
