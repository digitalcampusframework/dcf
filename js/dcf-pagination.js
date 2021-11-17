export class DCFPagination {
  constructor(Paginationlists) {
    this.Paginationlists = Paginationlists;
  }

  initialize() {
    Array.prototype.forEach.call(this.Paginationlists, (list) => {
      if (list.classList.contains('dcf-pagination-complete')) {
        return;
      }
      list.classList.add('dcf-pagination-complete');

      const nav = document.createElement('nav');
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Pagination Navigation');

      const listItems = list.getElementsByTagName('li');
      Array.prototype.forEach.call(listItems, (item) => {
        if (item.classList.contains('prev')) {
          item.setAttribute('aria-label', 'Go to the previous page.');
        } else if (item.classList.contains('next')) {
          item.setAttribute('aria-label', 'Go to the next page.');
        } else if (item.classList.contains('selected')) {
          item.setAttribute('aria-current', true);
          item.setAttribute('aria-label', 'The current page.');
        } else if (item.classList.contains('ellipsis')) {
          item.setAttribute('aria-hidden', true);
        } else {
          item.setAttribute('aria-label', 'Go to this page.');
        }
      });

      // Add nav after list
      list.after(nav);

      // Move list into nav
      nav.append(list);
    });
  }
}
