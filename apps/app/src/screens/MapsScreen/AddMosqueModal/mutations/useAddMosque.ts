import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMosque, type NewMosque } from '../../../../api/index';

export function useAddMosque(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mosque: NewMosque) => createMosque(mosque),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mosques'] });
      onSuccess();
    },
  });
}
