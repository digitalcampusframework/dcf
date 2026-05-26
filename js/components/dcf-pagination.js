import { uuidv4 } from '../dcf-utility.js';

export default class DCFPagination {

    uuid = uuidv4();

    paginationNav = null;

    list = null;

    listAnchors = [];

    listSpans = [];

    constructor(paginationNav) {
        this.paginationNav = paginationNav;
        if (this.paginationNav.getAttribute('id') === '' || this.paginationNav.getAttribute('id') === null) {
            this.paginationNav.setAttribute('id', this.uuid.concat('-pagination'));
        }

        this.paginationNav.setAttribute('role', 'navigation');
        this.paginationNav.setAttribute('aria-label', 'Pagination Navigation');

        const lists = this.paginationNav.getElementsByTagName('ol');
        if (lists.length !== 1) {
            // invalid format so bail
            return;
        }

        this.list = lists[0];
        this.list.classList.remove('dcf-list-inline');
        this.list.classList.add('dcf-list-bare', 'dcf-d-flex', 'dcf-flex-wrap', 'dcf-ai-center', 'dcf-col-gap-2', 'dcf-row-gap-2');
        this.list.setAttribute('role', 'list');

        this.listAnchors = Array.from(this.list.getElementsByTagName('a'));
        this.listAnchors.forEach((anchor) => {
            anchor.classList.add('dcf-btn', 'dcf-btn-secondary', 'dcf-txt-xs');
            if (anchor.classList.contains('dcf-pagination-first')) {
                anchor.setAttribute('aria-label', 'First page.');
            } else if (anchor.classList.contains('dcf-pagination-prev')) {
                anchor.setAttribute('aria-label', 'Previous page.');
            } else if (anchor.classList.contains('dcf-pagination-next')) {
                anchor.setAttribute('aria-label', 'Next page.');
            } else if (anchor.classList.contains('dcf-pagination-last')) {
                anchor.setAttribute('aria-label', 'Last page.');
            }
        });

        this.listSpans = Array.from(this.list.getElementsByTagName('span'));
        this.listSpans.forEach((span) => {
            if (span.classList.contains('dcf-pagination-selected')) {
                span.classList.add('dcf-txt-xs', 'dcf-bold');
                span.setAttribute('aria-current', true);
                span.setAttribute('aria-label', 'Current page.');
            } else if (span.classList.contains('dcf-pagination-ellipsis')) {
                span.classList.add('dcf-txt-xs');
                span.setAttribute('aria-hidden', true);
            }
        });

        this.paginationNav.classList.add('dcf-pagination-initialized');
        this.paginationNav.removeAttribute('hidden');

        this.paginationNav.dispatchEvent(new CustomEvent(DCFPagination.events('paginationReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    /**
     * Validates and returns standardized name of events for tabs
     * @static
     * @param { string } name - Name of the event to be returned
     * @returns { string } Standard name of the event
     */
    static events(name) {
        const events = {
            paginationReady: 'paginationReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }
}
