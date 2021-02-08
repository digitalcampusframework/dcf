class DCFTable {
  constructor(tables) {
    this.tables = tables;
  }

  initialize() {
    Array.prototype.forEach.call(this.tables, (table) => {
      // handle scrollable tables
      const tableParent = table.parentNode;
      if (tableParent && tableParent.classList.contains('dcf-overflow-x-auto')) {
        // add tabIndex to parent if missing
        if (!tableParent.hasAttribute('tabIndex')) {
          tableParent.setAttribute('tabIndex', DCFUtility.magicNumbers('int0'));
        }
      }
    });
  }
}
