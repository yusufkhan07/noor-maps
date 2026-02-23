import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Header
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

  // Action chips
  actionRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionChipLast: {
    marginRight: 4,
  },
  actionChipIcon: {
    fontSize: 14,
    color: '#1a6b3c',
  },
  actionChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },

  // Prayer times table
  prayerTimesContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    marginBottom: 2,
  },
  colHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colPrayer: {
    flex: 1.2,
  },
  colTime: {
    flex: 1,
    textAlign: 'right',
  },
  loader: {
    marginVertical: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  prayerLabel: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 15,
    color: '#1a6b3c',
    fontWeight: '600',
  },
  missingValue: {
    color: '#bbb',
    fontWeight: '400',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },

  // Contact section
  contactSection: {
    gap: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  contactLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
});
