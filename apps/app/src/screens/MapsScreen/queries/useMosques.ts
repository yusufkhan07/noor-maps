import { useQuery } from '@tanstack/react-query';
import { fetchMosques } from '../../../api';
import type { Mosque } from '../../MosqueBottomSheet/MosqueBottomSheet';

export function useMosques(): Mosque[] {
  const { data = [] } = useQuery({
    queryKey: ['mosques'],
    queryFn: fetchMosques,
  });
  return data;
}
