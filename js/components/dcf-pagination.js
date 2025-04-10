export default class DCFPagination {
    paginationNav = null;

    list = null;

    listAnchors = [];

    listSpans = [];

    constructor(paginationNav) {
        this.paginationNav = paginationNav;

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
    }
}
