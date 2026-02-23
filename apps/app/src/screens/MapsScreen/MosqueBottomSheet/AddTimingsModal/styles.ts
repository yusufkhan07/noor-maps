import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    minWidth: 64,
  },
  navButtonText: {
    fontSize: 16,
    color: '#1a6b3c',
    fontWeight: '600',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a6b3c',
    textAlign: 'right',
  },
  submitTextDisabled: {
    color: '#ccc',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },

  // Prayer selector list
  prayerList: {
    flex: 1,
    paddingTop: 8,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  prayerRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prayerName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  prayerFilledValue: {
    fontSize: 15,
    color: '#1a6b3c',
    fontWeight: '600',
  },
  prayerEmptyValue: {
    fontSize: 14,
    color: '#bbb',
  },
  chevron: {
    fontSize: 20,
    color: '#ccc',
  },
  note: {
    marginTop: 24,
    marginHorizontal: 20,
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Editor
  editor: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },

  // Drum roll time picker
  drumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  drumColon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  // Mode toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 3,
    marginBottom: 32,
  },
  modeTab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#1a1a1a',
  },

  // Relative editor
  relativeEditor: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
  },
  relativeDesc: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 24,
    color: '#1a1a1a',
    lineHeight: 28,
  },
  stepperValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    minWidth: 90,
    textAlign: 'center',
  },
  unsetBtn: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e53935',
  },
  unsetBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e53935',
  },

  errorBanner: {
    backgroundColor: '#fdecea',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f5c6c6',
  },
  errorBannerText: {
    fontSize: 13,
    color: '#c62828',
    textAlign: 'center',
  },
});
