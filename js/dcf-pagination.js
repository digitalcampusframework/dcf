export class DCFPagination {
  constructor(PaginationNavs) {
    this.PaginationNavs = PaginationNavs;
  }

  initialize() {
    Array.prototype.forEach.call(this.PaginationNavs, (nav) => {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Pagination Navigation');

      const list = nav.getElementsByTagName('ol');
      list.classList.remove('dcf-list-inline');
      list.classList.add('dcf-list-bare', 'dcf-d-flex', 'dcf-flex-wrap', 'dcf-ai-center', 'cf-col-gap-2', 'dcf-row-gap-2');

      const listAnchors = list.getElementsByTagName('a');
      Array.prototype.forEach.call(listAnchors, (anchor) => {
        anchor.classList.add('dcf-btn', 'dcf-btn-secondary');
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

      const listSpans = list.getElementsByTagName('span');
      Array.prototype.forEach.call(listSpans, (span) => {
        if (span.classList.contains('dcf-pagination-selected')) {
          span.classList.add('dcf-txt-sm', 'dcf-bold');
          span.setAttribute('aria-current', true);
          span.setAttribute('aria-label', 'Current page.');
        } else if (span.classList.contains('dcf-pagination-ellipsis')) {
          span.setAttribute('aria-hidden', true);
        }
      });
    });
  }
}
