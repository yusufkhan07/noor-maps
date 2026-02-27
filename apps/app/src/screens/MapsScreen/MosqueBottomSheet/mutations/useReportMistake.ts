import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMosque } from '../../../../api';

type ReportMistakeArgs = {
  mosqueId: string;
  patch: { address?: string; email?: string; website?: string; phone?: string };
};

export function useReportMistake(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mosqueId, patch }: ReportMistakeArgs) =>
      patchMosque(mosqueId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mosques'] });
      onSuccess();
    },
  });
}
