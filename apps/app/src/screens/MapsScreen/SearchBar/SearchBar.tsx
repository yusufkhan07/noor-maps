import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';

type Props = {
  onSelectResult: (latitude: number, longitude: number) => void;
};

type Result = {
  latitude: number;
  longitude: number;
  primary: string;
  secondary: string;
};

const buildResults = async (query: string): Promise<Result[]> => {
  const locations = await Location.geocodeAsync(query);
  const results = await Promise.all(
    locations.map(async ({ latitude, longitude }) => {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const primary =
        address?.name ?? address?.street ?? address?.city ?? query;
      const secondary = [address?.city, address?.region, address?.country]
        .filter(Boolean)
        .join(', ');
      return { latitude, longitude, primary, secondary };
    }),
  );
  return results;
};

const Separator = () => <View style={styles.separator} />;

export const SearchBar = ({ onSelectResult }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const built = await buildResults(text.trim());
      setIsSearching(false);
      setResults(built);
    }, 400);
  };

  const handleSelect = (result: Result) => {
    Keyboard.dismiss();
    setQuery('');
    setResults([]);
    onSelectResult(result.latitude, result.longitude);
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search city, address, landmark…"
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {isSearching ? (
          <ActivityIndicator size="small" color="#007AFF" style={styles.icon} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.icon}>
            <View style={styles.clearButton}>
              <View style={styles.clearLine1} />
              <View style={styles.clearLine2} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {results.length > 0 && (
        <FlatList
          style={styles.dropdown}
          data={results}
          keyExtractor={(_, index) => String(index)}
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.resultPrimary} numberOfLines={1}>
                {item.primary}
              </Text>
              <Text style={styles.resultSecondary} numberOfLines={1}>
                {item.secondary}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
