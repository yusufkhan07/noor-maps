import { StyleSheet } from 'react-native';

export const ITEM_HEIGHT = 48;
export const VISIBLE_ITEMS = 5;

export const drumStyles = StyleSheet.create({
  wrap: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 72,
    overflow: 'hidden',
  },
  selector: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 22,
    color: '#bbb',
    fontWeight: '400',
  },
  itemTextSelected: {
    fontSize: 26,
    color: '#1a1a1a',
    fontWeight: '700',
  },
});
