export class DCFScrollAnimation {
  constructor(itemList, observerConfig, animationClassNames) {
    this.itemList = itemList;
    this.observerConfig = observerConfig;
    this.animationClassNames = animationClassNames;
  }
  // Disconnect the observer
  disconnect() {
    if (!this.observer) {
      return;
    }
    this.observer.disconnect();
  }
  initialize() {
    // onIntersection callback function
    let onIntersection = (entries, observer) => {
      const zero = 0;
      const zeroIndex = 0;
      const oneIndex = 1;
      // Disconnect if we've already loaded all of the items
      if (this.itemsCount === zero) {
        this.observer.disconnect();
      }
      // Loop through the entries
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= observer.thresholds[zeroIndex] &&
          entry.intersectionRatio < observer.thresholds[oneIndex]) {
          // Add animation classes to entry
          if (this.animationClassNames.length) {
            this.animationClassNames.forEach((className) => entry.target.classList.add(className));
          }
        } else if (entry.intersectionRatio > observer.thresholds[oneIndex]) {
          this.itemsCount--;
          this.observer.unobserve(entry.target);
        }
      });
    };
    if (!this.itemList) {
      return;
    }
    this.itemsCount = this.itemList.length;
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(onIntersection, this.observerConfig);
      this.itemList.forEach((item) => {
        this.observer.observe(item);
      });
    }
  }
}
