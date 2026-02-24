import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f7f3',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c3dece',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 36,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a4d2e',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#2d6a4f',
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 4,
  },
  cta: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#1a6b3c',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  dismissText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    paddingVertical: 4,
  },
});
