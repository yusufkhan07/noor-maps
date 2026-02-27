import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navButton: {
    minWidth: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a6b3c',
    textAlign: 'right',
  },
  submitTextDisabled: {
    color: '#bbb',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  errorBanner: {
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
  },
  errorBannerText: {
    fontSize: 14,
    color: '#c0392b',
  },
  fieldList: {
    paddingHorizontal: 16,
    gap: 20,
  },
  fieldRow: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  fieldInputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
});
