import React, { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PrayerTimes } from './MosqueBottomSheet';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
const MINUTES = Array.from({ length: 60 }, (_, i) => i);   // 0–59
const PERIODS = ['AM', 'PM'];

type DrumColumn = { items: (number | string)[]; selected: number; onChange: (i: number) => void };

const DrumRoll = ({ items, selected, onChange }: DrumColumn) => {
  const ref = useRef<FlatList>(null);
  const padding = Math.floor(VISIBLE_ITEMS / 2);
  const padded = [...Array(padding).fill(null), ...items, ...Array(padding).fill(null)];

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    onChange(index);
    ref.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={drum.wrap}>
      <View style={drum.selector} pointerEvents="none" />
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
            <View style={drum.item}>
              <Text style={[drum.itemText, isSelected && drum.itemTextSelected]}>
                {item === null ? '' : typeof item === 'number' ? String(item).padStart(2, '0') : item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const drum = StyleSheet.create({
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

type TimingMode = 'fixed' | 'relative';

type PrayerEntry = {
  mode: TimingMode;
  time: Date;
  offsetMinutes: number;
  offsetDirection: '+' | '-';
};

type TimingsForm = Partial<Record<keyof PrayerTimes, PrayerEntry>>;

const PRAYERS: [keyof PrayerTimes, string][] = [
  ['Fajr', 'Fajr'],
  ['Dhuhr', 'Dhuhr'],
  ['Asr', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isha'],
];

const defaultEntry = (): PrayerEntry => ({
  mode: 'fixed',
  time: new Date(),
  offsetMinutes: 15,
  offsetDirection: '+',
});

const formatTime = (date: Date): string => {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

type Props = {
  visible: boolean;
  mosqueName: string;
  onClose: () => void;
  onSubmit: (form: TimingsForm) => void;
};

type Step = 'select' | 'edit';

export const AddTimingsModal = ({ visible, mosqueName, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<TimingsForm>({});
  const [step, setStep] = useState<Step>('select');
  const [activePrayer, setActivePrayer] = useState<keyof PrayerTimes | null>(null);

  const handleSelectPrayer = (key: keyof PrayerTimes) => {
    if (!form[key]) {
      setForm(f => ({ ...f, [key]: defaultEntry() }));
    }
    setActivePrayer(key);
    setStep('edit');
  };

  const handleBack = () => {
    setStep('select');
    setActivePrayer(null);
  };

  const handleClose = () => {
    setForm({});
    setStep('select');
    setActivePrayer(null);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({});
    setStep('select');
    setActivePrayer(null);
  };

  const updateEntry = (patch: Partial<PrayerEntry>) => {
    if (!activePrayer) return;
    setForm(f => ({
      ...f,
      [activePrayer]: { ...(f[activePrayer] ?? defaultEntry()), ...patch },
    }));
  };

  const activeEntry = activePrayer ? (form[activePrayer] ?? defaultEntry()) : null;
  const activePrayerLabel = PRAYERS.find(([k]) => k === activePrayer)?.[1] ?? '';
  const filledCount = Object.keys(form).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          {step === 'edit' ? (
            <TouchableOpacity onPress={handleBack} style={styles.navButton}>
              <Text style={styles.navButtonText}>‹ Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleClose} style={styles.navButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>
            {step === 'select' ? 'Select Prayer' : activePrayerLabel}
          </Text>

          <TouchableOpacity
            onPress={step === 'edit' ? handleBack : handleSubmit}
            style={styles.navButton}
            disabled={step === 'select' && filledCount === 0}
          >
            <Text style={[
              styles.submitText,
              step === 'select' && filledCount === 0 && styles.submitTextDisabled,
            ]}>
              {step === 'edit' ? 'Done' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>{mosqueName}</Text>

        {/* ── Step 1: Prayer selector ── */}
        {step === 'select' && (
          <View style={styles.prayerList}>
            {PRAYERS.map(([key, label]) => {
              const entry = form[key];
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.prayerRow}
                  onPress={() => handleSelectPrayer(key)}
                >
                  <Text style={styles.prayerName}>{label}</Text>
                  <View style={styles.prayerRowRight}>
                    {entry ? (
                      <Text style={styles.prayerFilledValue}>
                        {entry.mode === 'fixed'
                          ? formatTime(entry.time)
                          : `+${entry.offsetMinutes} min`}
                      </Text>
                    ) : (
                      <Text style={styles.prayerEmptyValue}>Tap to set</Text>
                    )}
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.note}>
              Timings will be reviewed before being shown to other users.
            </Text>
          </View>
        )}

        {/* ── Step 2: Time editor for the selected prayer ── */}
        {step === 'edit' && activeEntry && (
          <View style={styles.editor}>

            {/* Fixed / Relative toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeTab, activeEntry.mode === 'fixed' && styles.modeTabActive]}
                onPress={() => updateEntry({ mode: 'fixed' })}
              >
                <Text style={[styles.modeTabText, activeEntry.mode === 'fixed' && styles.modeTabTextActive]}>
                  Fixed time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, activeEntry.mode === 'relative' && styles.modeTabActive]}
                onPress={() => updateEntry({ mode: 'relative' })}
              >
                <Text style={[styles.modeTabText, activeEntry.mode === 'relative' && styles.modeTabTextActive]}>
                  Relative
                </Text>
              </TouchableOpacity>
            </View>

            {activeEntry.mode === 'fixed' ? (
              /* Pure-JS drum-roll time picker */
              (() => {
                const h = activeEntry.time.getHours();
                const hourIndex = (h % 12) === 0 ? 11 : (h % 12) - 1; // 0-based index into HOURS (1–12)
                const minuteIndex = activeEntry.time.getMinutes();
                const periodIndex = h < 12 ? 0 : 1;

                const setHour = (i: number) => {
                  const d = new Date(activeEntry.time);
                  const newHour12 = HOURS[i];
                  const isPM = d.getHours() >= 12;
                  d.setHours(isPM ? (newHour12 % 12) + 12 : newHour12 % 12);
                  updateEntry({ time: d });
                };
                const setMinute = (i: number) => {
                  const d = new Date(activeEntry.time);
                  d.setMinutes(MINUTES[i]);
                  updateEntry({ time: d });
                };
                const setPeriod = (i: number) => {
                  const d = new Date(activeEntry.time);
                  const cur = d.getHours();
                  if (i === 0 && cur >= 12) d.setHours(cur - 12);
                  if (i === 1 && cur < 12) d.setHours(cur + 12);
                  updateEntry({ time: d });
                };

                return (
                  <View style={styles.drumRow}>
                    <DrumRoll items={HOURS} selected={hourIndex} onChange={setHour} />
                    <Text style={styles.drumColon}>:</Text>
                    <DrumRoll items={MINUTES} selected={minuteIndex} onChange={setMinute} />
                    <DrumRoll items={PERIODS} selected={periodIndex} onChange={setPeriod} />
                  </View>
                );
              })()
            ) : (
              /* Relative: offset minutes + direction */
              <View style={styles.relativeEditor}>
                <Text style={styles.relativeDesc}>
                  Iqamah is after the {activePrayerLabel} Adhan by
                </Text>

                {/* Minute stepper */}
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => updateEntry({ offsetMinutes: Math.max(1, activeEntry.offsetMinutes - 5) })}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{activeEntry.offsetMinutes} min</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => updateEntry({ offsetMinutes: Math.min(120, activeEntry.offsetMinutes + 5) })}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

  // Time picker
  timePicker: {
    width: '100%',
    height: 216,
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
  relativeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dirBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    alignItems: 'center',
  },
  dirBtnActive: {
    backgroundColor: '#1a6b3c',
    borderColor: '#1a6b3c',
  },
  dirBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  dirBtnTextActive: {
    color: '#fff',
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
});
