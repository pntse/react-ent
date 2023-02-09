import { useRef } from 'react';
import { getValue } from '@rlean/utils';
import { useSave, useGlobalState } from '..';
import * as entities from '../_internal/entities';

export default function useOfflineQueue() {
  const save = useSave();
  const [{ rLean_OfflineQueue }] = useGlobalState<typeof entities>();
  const offlineQueueRef = useRef(rLean_OfflineQueue);

  const enqueue = (
    params: any,
    rlean_offlineQueueRef: typeof offlineQueueRef
  ) => {
    const { method, options, callback } = params;
    const data = getValue(rlean_offlineQueueRef, 'data', []);
    data.push({ method, options, callback });

    const stateValue = { data };

    save({ entity: entities.RLean_OfflineQueue, value: stateValue, add: true });
  };

  return (params: any) => {
    enqueue(params, offlineQueueRef);
  };
}
