import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../../../../app/translations';
import { ConfirmationModal } from '../../../../components/ConfirmationModal/ConfirmationModal';
import { PrayerTimes } from '../../MosqueBottomSheet/MosqueBottomSheet';
import { DrumRoll } from './DrumRoll';
import { styles } from './styles';

const T = t.addTimings;

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
const MINUTES = Array.from({ length: 60 }, (_, i) => i); // 0–59
const PERIODS = ['AM', 'PM'];

type TimingMode = 'fixed' | 'relative';

type PrayerEntry = {
  mode: TimingMode;
  time: Date;
  offsetMinutes: number;
  offsetDirection: '+' | '-';
};

export type TimingsForm = Partial<Record<keyof PrayerTimes, PrayerEntry>>;

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
  onSubmit: (form: TimingsForm) => Promise<void>;
};

type Step = 'select' | 'edit';

export const AddTimingsModal = ({
  visible,
  mosqueName,
  onClose,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<TimingsForm>({});
  const [step, setStep] = useState<Step>('select');
  const [activePrayer, setActivePrayer] = useState<keyof PrayerTimes | null>(
    null,
  );
  const [draftEntry, setDraftEntry] = useState<PrayerEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPrayer = (key: keyof PrayerTimes) => {
    setDraftEntry(form[key] ? { ...form[key]! } : defaultEntry());
    setActivePrayer(key);
    setStep('edit');
  };

  const handleDone = () => {
    if (activePrayer && draftEntry) {
      setForm((f) => ({ ...f, [activePrayer]: draftEntry }));
    }
    setStep('select');
    setActivePrayer(null);
    setDraftEntry(null);
  };

  const handleBack = () => {
    setStep('select');
    setActivePrayer(null);
    setDraftEntry(null);
  };

  const handleClose = () => {
    setForm({});
    setStep('select');
    setActivePrayer(null);
    setDraftEntry(null);
    setError(null);
    onClose();
  };

  const handleSubmitPress = () => {
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm({});
      setStep('select');
      setActivePrayer(null);
      setDraftEntry(null);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      setError(status === 429 ? T.rateLimitError : T.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnset = () => {
    if (!activePrayer) return;
    setForm((f) => {
      const next = { ...f };
      delete next[activePrayer];
      return next;
    });
    setStep('select');
    setActivePrayer(null);
    setDraftEntry(null);
  };

  const updateEntry = (patch: Partial<PrayerEntry>) => {
    setDraftEntry((d) => ({ ...(d ?? defaultEntry()), ...patch }));
  };

  const activeEntry = draftEntry;
  const activePrayerLabel =
    PRAYERS.find(([k]) => k === activePrayer)?.[1] ?? '';
  const filledCount = Object.keys(form).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          {step === 'edit' ? (
            <TouchableOpacity onPress={handleBack} style={styles.navButton}>
              <Text style={styles.navButtonText}>{T.back}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleClose}
              style={styles.navButton}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>{T.cancel}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>
            {step === 'select' ? T.selectPrayer : activePrayerLabel}
          </Text>

          <TouchableOpacity
            onPress={step === 'edit' ? handleDone : handleSubmitPress}
            style={styles.navButton}
            disabled={step === 'select' && (filledCount === 0 || isSubmitting)}
          >
            {step === 'select' && isSubmitting ? (
              <ActivityIndicator size="small" color="#1a6b3c" />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  step === 'select' &&
                    filledCount === 0 &&
                    styles.submitTextDisabled,
                ]}
              >
                {step === 'edit' ? T.done : T.submit}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>{mosqueName}</Text>

        {/* ── Error banner ── */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

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
                          : T.minAfterAzan(entry.offsetMinutes)}
                      </Text>
                    ) : (
                      <Text style={styles.prayerEmptyValue}>{T.tapToSet}</Text>
                    )}
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.note}>{T.reviewNote}</Text>
          </View>
        )}

        {/* ── Step 2: Time editor for the selected prayer ── */}
        {step === 'edit' && activeEntry && (
          <View style={styles.editor}>
            {/* Fixed / Relative toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[
                  styles.modeTab,
                  activeEntry.mode === 'fixed' && styles.modeTabActive,
                ]}
                onPress={() => updateEntry({ mode: 'fixed' })}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    activeEntry.mode === 'fixed' && styles.modeTabTextActive,
                  ]}
                >
                  {T.fixedTime}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeTab,
                  activeEntry.mode === 'relative' && styles.modeTabActive,
                ]}
                onPress={() => updateEntry({ mode: 'relative' })}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    activeEntry.mode === 'relative' && styles.modeTabTextActive,
                  ]}
                >
                  {T.relative}
                </Text>
              </TouchableOpacity>
            </View>

            {activeEntry.mode === 'fixed' ? (
              /* Pure-JS drum-roll time picker */
              (() => {
                const h = activeEntry.time.getHours();
                const hourIndex = h % 12 === 0 ? 11 : (h % 12) - 1; // 0-based index into HOURS (1–12)
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
                    <DrumRoll
                      items={HOURS}
                      selected={hourIndex}
                      onChange={setHour}
                    />
                    <Text style={styles.drumColon}>:</Text>
                    <DrumRoll
                      items={MINUTES}
                      selected={minuteIndex}
                      onChange={setMinute}
                    />
                    <DrumRoll
                      items={PERIODS}
                      selected={periodIndex}
                      onChange={setPeriod}
                    />
                  </View>
                );
              })()
            ) : (
              /* Relative: offset minutes */
              <View style={styles.relativeEditor}>
                <Text style={styles.relativeDesc}>
                  {T.relativeDesc(activePrayerLabel)}
                </Text>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() =>
                      updateEntry({
                        offsetMinutes: Math.max(
                          1,
                          activeEntry.offsetMinutes - 1,
                        ),
                      })
                    }
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>
                    {T.minutes(activeEntry.offsetMinutes)}
                  </Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() =>
                      updateEntry({
                        offsetMinutes: Math.min(
                          120,
                          activeEntry.offsetMinutes + 1,
                        ),
                      })
                    }
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activePrayer && form[activePrayer] && (
              <TouchableOpacity style={styles.unsetBtn} onPress={handleUnset}>
                <Text style={styles.unsetBtnText}>{T.remove}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>

      <ConfirmationModal
        visible={showConfirm}
        title={T.confirmTitle}
        body={T.confirmBody}
        submitLabel={T.confirmSubmit}
        cancelLabel={T.confirmCancel}
        onSubmit={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </Modal>
  );
};
