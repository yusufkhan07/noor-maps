import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#f0f7f3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c3dece',
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  body: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a4d2e',
  },
  description: {
    fontSize: 13,
    color: '#2d6a4f',
    lineHeight: 18,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#1a6b3c',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  dismissBtn: {
    paddingLeft: 4,
    paddingTop: 2,
  },
  dismissText: {
    fontSize: 16,
    color: '#888',
    lineHeight: 20,
  },
});
