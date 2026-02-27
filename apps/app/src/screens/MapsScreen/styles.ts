import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    fontSize: 28,
  },
  pinnedMarker: {
    fontSize: 32,
  },
  callout: {
    width: 160,
    padding: 8,
  },
  calloutBtn: {
    backgroundColor: '#1a6b3c',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  calloutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  locationPopup: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  locationPopupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  locationPopupBtn: {
    backgroundColor: '#1a6b3c',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  locationPopupBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  locationPopupCancel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 4,
  },
  radiusLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 112, 200, 0.4)',
  },
  radiusLabelText: {
    fontSize: 10,
    color: 'rgba(0, 90, 180, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
