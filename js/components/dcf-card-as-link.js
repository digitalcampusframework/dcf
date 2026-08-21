// Based on https://inclusive-components.design/cards/
// Using mousedown and mouseup to allow selecting text without trigger click
export default class DCFCardAsLink {
    card = null;

    link = null;

    mouseDown = 0;

    mouseUp = 0;

    cursorStyle = 'pointer';

    clickThresholdMs = 200;

    // Set up the Card as Link component
    constructor(card) {
        this.card = card;

        this.link = card.querySelector('.dcf-card-link');
        if (!this.link) {
            this.link = card.querySelector('a');
        }

        // Add event listeners only if a link is present in the card
        if (this.link) {
            this.card.addEventListener('mousedown', (event) => {
                if (event.button !== 0) {
                    return;
                }
                this.mouseDown = Number(new Date());
            });

            this.card.addEventListener('mouseup', (event) => {
                if (event.button !== 0) {
                    return;
                }
                this.mouseUp = Number(new Date());
                if ((this.mouseUp - this.mouseDown) < this.clickThresholdMs) {
                    this.link.click();
                }
            });
            this.card.style.cursor = this.cursorStyle;
        }

        this.card.classList.add('dcf-card-as-link-initialized');
        this.card.removeAttribute('hidden');

        // Dispatch the event to notify that the card is ready.
        this.card.dispatchEvent(new CustomEvent(DCFCardAsLink.events('cardAsLinkReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
            cardAsLinkReady: 'cardAsLinkReady',
        };
        Object.freeze(events);

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }
}
