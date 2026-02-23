import { useMutation } from '@tanstack/react-query';
import { patchMosqueTimings } from '../../../../api';

type SaveTimingsArgs = {
  mosqueId: string;
  fixed: Record<string, string>;
};

export function useSaveTimings(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({ mosqueId, fixed }: SaveTimingsArgs) =>
      patchMosqueTimings(mosqueId, fixed),
    onSuccess,
  });
}
