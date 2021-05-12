// Based on https://inclusive-components.design/cards/
// Using mousedown and mouseup to allow selecting text without trigger click
class DCFCardAsLink {
  constructor(cards) {
    this.cards = cards;
  }

  initialize() {
    Array.prototype.forEach.call(this.cards, (card) => {
      let down = 0;
      let up = 0;
      const link = card.querySelector('.dcf-card-link');
      card.onmousedown = () => {
        down = Number(new Date());
      };

      card.onmouseup = () => {
        up = Number(new Date());
        const int200 = 200;
        if (up - down < int200) {
          link.click();
        }
      };

      card.style.cursor = 'pointer';
    });
  }
}
