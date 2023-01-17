import { initialState } from "./initialState";
import Adapters from "./Adapters";
import { define } from "./define";
import { keys } from "./keys";
import useSave from "./hooks/useSave";
import useRequest from "./hooks/useRequest";
import useGet from "./hooks/useGet";
import usePatch from "./hooks/usePatch";
import usePost from "./hooks/usePost";
import usePut from "./hooks/usePut";
import useDelete from "./hooks/useDelete";
import useRemove from "./hooks/useRemove";
import useSyncState from "./hooks/useSyncState";
import RLean from "./RLean";
import { reducer } from "./reducer";
import { removeAll } from "./removeAll";
import Store from "./Store";
import { StateSingleton } from "./StateSingleton";
import { RLeanBaseHooks } from "./BaseHooks";

import { ApiAdapter, APIResponse, RLeanConfig } from "./types";

export {
  initialState,
  define,
  keys,
  Adapters,
  useRequest,
  usePatch,
  usePost,
  usePut,
  useDelete,
  RLean,
  reducer,
  useRemove,
  removeAll,
  Store,
  useGet,
  useSave,
  useSyncState,
  StateSingleton,
  RLeanBaseHooks,
  // types & interfaces
  ApiAdapter,
  APIResponse,
  RLeanConfig,
};
