import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PrayerTimes } from '../MosqueBottomSheet/MosqueBottomSheet';
import { DrumRoll } from './DrumRoll';
import { styles } from './styles';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
const MINUTES = Array.from({ length: 60 }, (_, i) => i);   // 0–59
const PERIODS = ['AM', 'PM'];

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

  const handleUnset = () => {
    if (!activePrayer) return;
    setForm(f => {
      const next = { ...f };
      delete next[activePrayer];
      return next;
    });
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
              /* Relative: offset minutes */
              <View style={styles.relativeEditor}>
                <Text style={styles.relativeDesc}>
                  Iqamah is after the {activePrayerLabel} Adhan by
                </Text>

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

            {activePrayer && form[activePrayer] && (
              <TouchableOpacity style={styles.unsetBtn} onPress={handleUnset}>
                <Text style={styles.unsetBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
