const TouchEvent = () => {
  let startX = 0;
  return {
    start: callback => (evt, ownerInstance) => {
      const enhancedEvent = { ...evt };
      startX = enhancedEvent.changedTouches[0].pageX;
      enhancedEvent.changedTouches[0].startX = startX;
      enhancedEvent.changedTouches[0].deltaX = 0;
      return callback(enhancedEvent, ownerInstance);
    },

    move: callback => (evt, ownerInstance) => {
      const enhancedEvent = { ...evt };
      const currentX = evt.changedTouches[0].pageX;
      const deltaX = currentX - startX;
      enhancedEvent.changedTouches[0].startX = startX;
      enhancedEvent.changedTouches[0].deltaX = deltaX;
      return callback(enhancedEvent, ownerInstance);
    },

    end: callback => (evt, ownerInstance) => {
      const enhancedEvent = { ...evt };
      const currentX = evt.changedTouches[0].pageX;
      const deltaX = currentX - startX;
      enhancedEvent.changedTouches[0].startX = startX;
      enhancedEvent.changedTouches[0].deltaX = deltaX;
      enhancedEvent.changedTouches[0].endX = currentX;
      startX = 0;
      return callback(enhancedEvent, ownerInstance);
    },
  };
};

module.exports = {
  TouchEvent,
};
