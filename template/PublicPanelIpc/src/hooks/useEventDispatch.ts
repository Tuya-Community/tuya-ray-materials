import { useState, useRef } from 'react';

const useEventDispatch = () => {
  const listenersRef = useRef(new Map());

  const addListener = (eventName, listener) => {
    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, []);
    }
    listenersRef.current.get(eventName).push(listener);
  };

  const removeListener = (eventName, listenerToRemove) => {
    if (listenersRef.current.has(eventName)) {
      const newListeners = listenersRef.current
        .get(eventName)
        .filter(listener => listener !== listenerToRemove);
      if (newListeners.length > 0) {
        listenersRef.current.set(eventName, newListeners);
      } else {
        listenersRef.current.delete(eventName);
      }
    }
  };

  const dispatchEvent = (eventName, data) => {
    if (listenersRef.current.has(eventName)) {
      listenersRef.current.get(eventName).forEach(listener => listener(data));
    }
  };

  return { addListener, removeListener, dispatchEvent };
};

export default useEventDispatch;
