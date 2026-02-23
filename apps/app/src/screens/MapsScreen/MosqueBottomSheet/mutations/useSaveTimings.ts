import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMosqueTimings } from '../../../../api';

type SaveTimingsArgs = {
  mosqueId: string;
  fixed: Record<string, string>;
};

export function useSaveTimings(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mosqueId, fixed }: SaveTimingsArgs) =>
      patchMosqueTimings(mosqueId, fixed),
    onSuccess: (_data, { mosqueId }) => {
      queryClient.invalidateQueries({ queryKey: ['prayerData', mosqueId] });
      onSuccess();
    },
  });
}
