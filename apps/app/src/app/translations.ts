export const t = {
  // ── AddTimingsModal ──────────────────────────────────────
  addTimings: {
    back: '‹ Back',
    cancel: 'Cancel',
    selectPrayer: 'Select Prayer',
    done: 'Done',
    submit: 'Submit',
    tapToSet: 'Tap to set',
    minAfterAzan: (n: number) => `${n} min after azan`,
    reviewNote:
      'Timings will be reviewed before being shown to other users.',
    fixedTime: 'Fixed time',
    relative: 'Relative',
    relativeDesc: (prayer: string) =>
      `Iqamah is after the ${prayer} Adhan by`,
    minutes: (n: number) => `${n} min`,
    remove: 'Remove',
    submitError: 'Failed to save timings. Please try again.',
    rateLimitError:
      'You have already submitted timings for this mosque today. Please try again tomorrow.',
    confirmTitle: 'Submit Timings?',
    confirmBody:
      'These times affect prayer timings for the whole community. Please double-check they are correct before submitting.\n\nYou can only submit once per day.',
    confirmSubmit: 'Submit',
    confirmCancel: 'Go Back',
  },
};
