/**
 * dbEvents.js
 * Centralized reactive event bus for local-first IndexedDB mutations.
 * Broadcasts changes locally and across browser tabs.
 */

const DB_CHANGE_EVENT = 'gearflow:db-change';
const CHANNEL_NAME = 'gearflow:broadcast';

let debounceTimer = null;
let broadcastChannel = null;

if (typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    broadcastChannel = null;
  }
}

export function notifyDbChange() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT));
    }
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'DB_CHANGED', timestamp: Date.now() });
      } catch {
        // Ignore channel postMessage errors
      }
    }
  }, 50);
}

export function subscribeToDbChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  window.addEventListener(DB_CHANGE_EVENT, handleCustomEvent);

  let handleBroadcast = null;
  if (broadcastChannel) {
    handleBroadcast = (event) => {
      if (event?.data?.type === 'DB_CHANGED') {
        callback();
      }
    };
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener(DB_CHANGE_EVENT, handleCustomEvent);
    if (broadcastChannel && handleBroadcast) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}
