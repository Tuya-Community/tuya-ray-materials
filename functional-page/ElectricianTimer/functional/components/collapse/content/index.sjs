const queryComponent = (ownerInstance, classSelector) => {
  return ownerInstance.selectComponent(`.${classSelector}`);
};

const observerProp = (newValue, oldValue, ownerInstance) => {
  setTimeout(() => {
    const box = queryComponent(ownerInstance, 'my-collapse-box');
    const contentDom = queryComponent(ownerInstance, 'my-collapse-content');
    const { status } = box.getDataset();
    let height = 0;
    if (status) {
      const res = contentDom.getBoundingClientRect();
      height = res.height;
    }
    box.setStyle({
      height: height + 'px',
    });
  }, 1000 / 30);
};

module.exports = {
  observerProp,
};
