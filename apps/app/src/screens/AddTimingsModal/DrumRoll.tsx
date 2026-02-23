import React, { useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import { drumStyles, ITEM_HEIGHT, VISIBLE_ITEMS } from './DrumRoll.styles';

type Props = {
  items: (number | string)[];
  selected: number;
  onChange: (i: number) => void;
};

export const DrumRoll = ({ items, selected, onChange }: Props) => {
  const ref = useRef<FlatList>(null);
  const padding = Math.floor(VISIBLE_ITEMS / 2);
  const padded = [...Array(padding).fill(null), ...items, ...Array(padding).fill(null)];

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    onChange(index);
    ref.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={drumStyles.wrap}>
      <View style={drumStyles.selector} pointerEvents="none" />
      <FlatList
        ref={ref}
        data={padded}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selected}
        getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item, index }) => {
          const realIndex = index - padding;
          const isSelected = realIndex === selected;
          return (
            <View style={drumStyles.item}>
              <Text style={[drumStyles.itemText, isSelected && drumStyles.itemTextSelected]}>
                {item === null ? '' : typeof item === 'number' ? String(item).padStart(2, '0') : item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};
