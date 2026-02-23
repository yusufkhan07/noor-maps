import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
});
