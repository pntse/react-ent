import { useEffect, useState } from 'react';
import { getValue } from '@rlean/utils';
import {
  useGlobalState,
  usePatch,
  usePut,
  usePost,
  useDelete,
  useRemove,
} from '../..';
import { methods } from '..';
import { RLean_OfflineQueue } from '../entities';

const getIsOnline = () => {
  return typeof navigator !== 'undefined' &&
    typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
};

export default function useProcessQueue() {
  const [{ rlean_offlineQueue }] = useGlobalState();
  const [isOnline, setIsOnline] = useState(getIsOnline());
  const [post] = usePost();
  const [del] = useDelete();
  const [put] = usePut();
  const [patch] = usePatch();
  const [remove] = useRemove();

  const goOnline = () => setIsOnline(true);
  const goOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    if (isOnline) {
      const data = getValue(rlean_offlineQueue, 'data', []);

      for (let i = 0; i < data.length; i += 1) {
        const method = data[i].method;
        const options = data[i].options;
        const callback = data[i].callback;

        switch (method) {
          case methods.POST:
            post(options, callback);
            break;
          case methods.PUT:
            put(options, callback);
            break;
          case methods.PATCH:
            patch(options, callback);
            break;
          case methods.DELETE:
            del(options, callback);
            break;
          default:
            // unrecognized method
            break;
        }
      }

      remove({ entity: RLean_OfflineQueue });

      return () => {
        window.removeEventListener('online', goOnline);
        window.removeEventListener('offline', goOffline);
      };
    }
  }, [isOnline]);
}
