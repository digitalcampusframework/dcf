class DCFDatepicker {
  constructor(datepicker) {
    // Define common magic numbers used
    this.int0 = DCFUtility.magicNumbers('int0');
    this.int1 = DCFUtility.magicNumbers('int1');
    this.int2 = DCFUtility.magicNumbers('int2');
    this.int3 = DCFUtility.magicNumbers('int3');
    this.int6 = DCFUtility.magicNumbers('int6');
    this.int7 = DCFUtility.magicNumbers('int7');
    this.intMinus1 = DCFUtility.magicNumbers('intMinus1');

    this.datepicker = datepicker;
    this.uuid = DCFUtility.uuidv4();
    this.buttonLabelChoose = 'Choose Date';
    this.buttonLabelChange = 'Change Date';
    this.dayLabels = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.monthLabels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.messageCursorKeys = 'Cursor keys can navigate dates';
    this.lastMessage = '';

    this.lastRowNode = null;
    this.days = [];
    this.focusDay = new Date();
    this.selectedDay = new Date(this.int0, this.int0, this.int1);
    this.isMouseDownOnBackground = false;

    this.textboxNode = this.datepicker.querySelector('input[type="text"]');

    this.appendPickerContainer();
    this.appendDialog();
    this.init();
  }

  parseInt(string) {
    const radix = 10;
    return parseInt(string, radix);
  }

  appendPickerContainer() {
    const pickerContainer = document.createElement('div');
    pickerContainer.classList.add('dcf-input-group');
    pickerContainer.append(this.textboxNode);

    this.buttonNode = document.createElement('button');
    this.buttonNode.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-datepicker');
    this.buttonNode.setAttribute('aria-label', 'Choose Date');
    // remove once dcf-btn-datepicker defined
    this.buttonNode.innerHTML = '&#128197;';
    pickerContainer.appendChild(this.buttonNode);
    this.datepicker.append(pickerContainer);
  }

  appendDialog() {
    const dialogLabelID = this.uuid.concat('-dialog-label');
    const dialogGridID = this.uuid.concat('-dialog-grid');

    this.dialogNode = document.createElement('div');
    this.dialogNode.style.display = 'none';
    this.dialogNode.setAttribute('id', this.uuid.concat('-datepicker'));
    this.dialogNode.setAttribute('role', 'dialog');
    this.dialogNode.setAttribute('aria-modal', 'true');
    this.dialogNode.setAttribute('aria-labelledby', dialogLabelID);
    this.dialogNode.classList.add('dcf-datepicker-dialog');

    let dialogHeader = document.createElement('div');
    dialogHeader.classList.add('header');

    this.prevYearNode = document.createElement('button');
    this.prevYearNode.setAttribute('aria-label', 'previous year');
    this.prevYearNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'prev-year');
    this.prevYearNode.innerHTML = '&laquo;';
    dialogHeader.append(this.prevYearNode);

    this.prevMonthNode = document.createElement('button');
    this.prevMonthNode.setAttribute('aria-label', 'previous month');
    this.prevMonthNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'prev-month');
    this.prevMonthNode.innerHTML = '&lsaquo;';
    dialogHeader.append(this.prevMonthNode);

    this.monthYearNode = document.createElement('h2');
    this.monthYearNode.setAttribute('id', dialogLabelID);
    this.monthYearNode.setAttribute('aria-live', 'polite');
    dialogHeader.append(this.monthYearNode);

    this.nextMonthNode = document.createElement('button');
    this.nextMonthNode.setAttribute('aria-label', 'next month');
    this.nextMonthNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'next-month');
    this.nextMonthNode.innerHTML = '&rsaquo;';
    dialogHeader.append(this.nextMonthNode);

    this.nextYearNode = document.createElement('button');
    this.nextYearNode.setAttribute('aria-label', 'next year');
    this.nextYearNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'next-year');
    this.nextYearNode.innerHTML = '&raquo;';
    dialogHeader.append(this.nextYearNode);

    const calanderTable = document.createElement('table');
    calanderTable.setAttribute('id', dialogGridID);
    calanderTable.setAttribute('role', 'grid');
    calanderTable.setAttribute('aria-labelledby', dialogLabelID);
    calanderTable.classList.add('dates');
    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');
    Array.prototype.forEach.call(this.dayLabels, (dayLabel) => {
      const dayHead = document.createElement('th');
      dayHead.setAttribute('scope', 'col');
      dayHead.setAttribute('abbr', dayLabel);
      dayHead.innerText = dayLabel.substring(this.int0, this.int2);
      theadRow.append(dayHead);
    });
    thead.append(theadRow);
    calanderTable.append(thead);
    this.tbodyNode = document.createElement('tbody');
    calanderTable.append(this.tbodyNode);

    const dialogBtnGroup = document.createElement('div');
    dialogBtnGroup.classList.add('dialog-ok-cancel-group');
    this.okButtonNode = document.createElement('button');
    this.okButtonNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'dialog-button');
    this.okButtonNode.setAttribute('value', 'ok');
    this.okButtonNode.innerText = 'OK';
    dialogBtnGroup.append(this.okButtonNode);

    this.cancelButtonNode = document.createElement('button');
    this.cancelButtonNode = document.createElement('button');
    this.cancelButtonNode.classList.add('dcf-btn', 'dcf-btn-secondary', 'dialog-button');
    this.cancelButtonNode.setAttribute('value', 'cancel');
    this.cancelButtonNode.innerText = 'Cancel';
    dialogBtnGroup.append(this.cancelButtonNode);

    this.messageNode = document.createElement('div');
    this.messageNode.classList.add('dialog-message');
    this.messageNode.setAttribute('aria-live', 'polite');

    this.dialogNode.append(dialogHeader);
    this.dialogNode.append(calanderTable);
    this.dialogNode.append(dialogBtnGroup);
    this.dialogNode.append(this.messageNode);
    this.datepicker.appendChild(this.dialogNode);
  }

  init() {
    this.textboxNode.addEventListener('blur', this.setDateForButtonLabel());

    this.buttonNode.addEventListener('keydown', (event) => {
      this.handleButtonKeydown(event);
    });

    this.buttonNode.addEventListener('click', (event) => {
      this.handleButtonClick(event);
    });

    this.okButtonNode.addEventListener('click', (event) => {
      this.handleOkButton(event);
    });

    this.okButtonNode.addEventListener('keydown', (event) => {
      this.handleOkButton(event);
    });

    this.cancelButtonNode.addEventListener('click', (event) => {
      this.handleCancelButton(event);
    });

    this.cancelButtonNode.addEventListener('keydown', (event) => {
      this.handleCancelButton(event);
    });

    this.prevMonthNode.addEventListener('click', (event) => {
      this.handlePreviousMonthButton(event);
    });

    this.nextMonthNode.addEventListener('click', (event) => {
      this.handleNextMonthButton(event);
    });

    this.prevYearNode.addEventListener('click', (event) => {
      this.handlePreviousYearButton(event);
    });

    this.nextYearNode.addEventListener('click', (event) => {
      this.handleNextYearButton(event);
    });

    this.prevMonthNode.addEventListener('keydown', (event) => {
      this.handlePreviousMonthButton(event);
    });

    this.nextMonthNode.addEventListener('keydown', (event) => {
      this.handleNextMonthButton(event);
    });

    this.prevYearNode.addEventListener('keydown', (event) => {
      this.handlePreviousYearButton(event);
    });

    this.nextYearNode.addEventListener('keydown', (event) => {
      this.handleNextYearButton(event);
    });

    document.body.addEventListener('mouseup', (event) => {
      this.handleBackgroundMouseUp(event);
    }, true);

    // Create Grid of Dates
    this.tbodyNode.innerHTML = '';
    for (let indexI = 0; indexI < this.int6; indexI++) {
      let row = this.tbodyNode.insertRow(indexI);
      this.lastRowNode = row;
      for (let indexJ = 0; indexJ < this.int7; indexJ++) {
        let cell = document.createElement('td');

        cell.tabIndex = this.intMinus1;
        cell.addEventListener('click', this.handleDayClick.bind(this));
        cell.addEventListener('keydown', this.handleDayKeyDown.bind(this));
        cell.addEventListener('focus', this.handleDayFocus.bind(this));

        cell.textContent = '-1';

        row.appendChild(cell);
        this.days.push(cell);
      }
    }

    this.updateGrid();
    this.close(false);
    this.setDateForButtonLabel();
  }

  isSameDay(day1, day2) {
    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  }

  isNotSameMonth(day1, day2) {
    return (
      day1.getFullYear() !== day2.getFullYear() ||
      day1.getMonth() !== day2.getMonth()
    );
  }

  updateGrid() {
    let flag = false;
    let fd = this.focusDay;

    this.monthYearNode.textContent = `${this.monthLabels[fd.getMonth()]} ${fd.getFullYear()}`;

    let firstDayOfMonth = new Date(fd.getFullYear(), fd.getMonth(), this.int1);
    let dayOfWeek = firstDayOfMonth.getDay();

    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek);

    let fdom = new Date(firstDayOfMonth);

    for (let indexI = 0; indexI < this.days.length; indexI++) {
      flag = fdom.getMonth() !== fd.getMonth();
      this.updateDate(this.days[indexI], flag, fdom, this.isSameDay(fdom, this.selectedDay));
      fdom.setDate(fdom.getDate() + this.int1);

      // Hide last row if all dates are disabled (e.g. in next month)
      const int35 = 35;
      if (indexI === int35) {
        if (flag) {
          this.lastRowNode.style.visibility = 'hidden';
        } else {
          this.lastRowNode.style.visibility = 'visible';
        }
      }
    }
  }

  updateDate(
    domNode,
    disable,
    day,
    selected
  ) {
    const int9 = 9;
    let dayString = day.getDate().toString();
    if (day.getDate() <= int9) {
      dayString = `0${dayString}`;
    }

    let monthString = day.getMonth() + this.int1;
    if (day.getMonth() < int9) {
      monthString = `0${monthString}`;
    }

    domNode.tabIndex = this.intMinus1;
    domNode.removeAttribute('aria-selected');
    domNode.setAttribute('data-date', `${day.getFullYear()}-${monthString}-${dayString}`);

    if (disable) {
      domNode.classList.add('disabled');
      domNode.textContent = '';
    } else {
      domNode.classList.remove('disabled');
      domNode.textContent = day.getDate();
      if (selected) {
        domNode.setAttribute('aria-selected', 'true');
        domNode.tabIndex = this.int0;
      }
    }
  }

  moveFocusToDay(day) {
    let cfd = this.focusDay;

    this.focusDay = day;

    if (
      cfd.getMonth() !== this.focusDay.getMonth() ||
      cfd.getYear() !== this.focusDay.getYear()
    ) {
      this.updateGrid();
    }
    this.setFocusDay();
  }

  setFocusDay(flagParam) {
    let flag = flagParam;
    if (typeof flag !== 'boolean') {
      flag = true;
    }

    for (let indexI = 0; indexI < this.days.length; indexI++) {
      let dayNode = this.days[indexI];
      let day = this.getDayFromDataDateAttribute(dayNode);

      dayNode.tabIndex = this.intMinus1;
      if (this.isSameDay(day, this.focusDay)) {
        dayNode.tabIndex = this.int0;
        if (flag) {
          dayNode.focus();
        }
      }
    }
  }

  open() {
    this.dialogNode.style.display = 'block';
    this.dialogNode.style.zIndex = this.int2;

    this.getDateFromTextbox();
    this.updateGrid();
  }

  isOpen() {
    return window.getComputedStyle(this.dialogNode).display !== 'none';
  }

  close(flagParam) {
    let flag = flagParam;
    if (typeof flag !== 'boolean') {
      // Default is to move focus to combobox
      flag = true;
    }

    this.setMessage('');
    this.dialogNode.style.display = 'none';

    if (flag) {
      this.buttonNode.focus();
    }
  }

  moveToNextYear() {
    this.focusDay.setFullYear(this.focusDay.getFullYear() + this.int1);
    this.updateGrid();
  }

  moveToPreviousYear() {
    this.focusDay.setFullYear(this.focusDay.getFullYear() - this.int1);
    this.updateGrid();
  }

  moveToNextMonth() {
    this.focusDay.setMonth(this.focusDay.getMonth() + this.int1);
    this.updateGrid();
  }

  moveToPreviousMonth() {
    this.focusDay.setMonth(this.focusDay.getMonth() - this.int1);
    this.updateGrid();
  }

  moveFocusToNextDay() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() + this.int1);
    this.moveFocusToDay(fd);
  }

  moveFocusToNextWeek() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() + this.int7);
    this.moveFocusToDay(fd);
  }

  moveFocusToPreviousDay() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() - this.int1);
    this.moveFocusToDay(fd);
  }

  moveFocusToPreviousWeek() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() - this.int7);
    this.moveFocusToDay(fd);
  }

  moveFocusToFirstDayOfWeek() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() - fd.getDay());
    this.moveFocusToDay(fd);
  }

  moveFocusToLastDayOfWeek() {
    let fd = new Date(this.focusDay);
    fd.setDate(fd.getDate() + (this.int6 - fd.getDay()));
    this.moveFocusToDay(fd);
  }

  // Day methods
  isDayDisabled(domNode) {
    return domNode.classList.contains('disabled');
  }

  getDayFromDataDateAttribute(domNode) {
    let parts = domNode.getAttribute('data-date').split('-');
    return new Date(parts[this.int0], this.parseInt(parts[this.int1]) - this.int1, parts[this.int2]);
  }

  // Textbox methods
  setTextboxDate(domNode) {
    let fd = this.focusDay;

    if (domNode) {
      fd = this.getDayFromDataDateAttribute(domNode);
      // updated aria-selected
      this.days.forEach((day) => {
        if (day === domNode) {
          day.setAttribute('aria-selected', 'true');
        } else {
          day.removeAttribute('aria-selected');
        }
      });
    }

    this.textboxNode.value = `${fd.getMonth() + this.int1}/${fd.getDate()}/${fd.getFullYear()}`;
    this.setDateForButtonLabel();
  }

  getDateFromTextbox() {
    let parts = this.textboxNode.value.split('/');
    let month = this.parseInt(parts[this.int0]);
    let day = this.parseInt(parts[this.int1]);
    let year = this.parseInt(parts[this.int2]);

    if (
      parts.length === this.int3 &&
      Number.isInteger(month) &&
      Number.isInteger(day) &&
      Number.isInteger(year)
    ) {
      const int100 = 100;
      const int2000 = 2000;
      if (year < int100) {
        year = int2000 + year;
      }
      this.focusDay = new Date(year, month - this.int1, day);
      this.selectedDay = new Date(this.focusDay);
    } else {
      // If not a valid date (MM/DD/YY) initialize with todays date
      this.focusDay = new Date();
      this.selectedDay = new Date(this.int0, this.int0, this.int1);
    }
  }

  setDateForButtonLabel() {
    let parts = this.textboxNode.value.split('/');

    if (
      parts.length === this.int3 &&
      Number.isInteger(this.parseInt(parts[this.int0])) &&
      Number.isInteger(this.parseInt(parts[this.int1])) &&
      Number.isInteger(this.parseInt(parts[this.int2]))
    ) {
      let day = new Date(
        this.parseInt(parts[this.int2]),
        this.parseInt(parts[this.int0]) - this.int1,
        this.parseInt(parts[this.int1])
      );

      let date = `${this.monthLabels[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`;
      let label = `${this.buttonLabelChange}, ${this.dayLabels[day.getDay()]} ${date}`;
      this.buttonNode.setAttribute('aria-label', label);
    } else {
      // If not a valid date, initialize with "Choose Date"
      this.buttonNode.setAttribute('aria-label', this.buttonLabelChoose);
    }
  }

  setMessage(str) {
    let setMessageDelayed = () => {
      this.messageNode.textContent = str;
    };

    if (str !== this.lastMessage) {
      const int200 = 200;
      setTimeout(setMessageDelayed(), int200);
      this.lastMessage = str;
    }
  }

  // Event handlers
  handleOkButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Tab':
        if (!event.shiftKey) {
          this.prevYearNode.focus();
          flag = true;
        }
        break;

      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      default:
        flag = false;
        break;
      }
      break;

    case 'click':
      this.setTextboxDate();
      this.close();
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleCancelButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      default:
        flag = false;
        break;
      }
      break;

    case 'click':
      this.close();
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleNextYearButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      case 'Enter':
        this.moveToNextYear();
        this.setFocusDay(false);
        flag = true;
        break;

      default:
        flag = false;
        break;
      }

      break;

    case 'click':
      this.moveToNextYear();
      this.setFocusDay(false);
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handlePreviousYearButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Enter':
        this.moveToPreviousYear();
        this.setFocusDay(false);
        flag = true;
        break;

      case 'Tab':
        if (event.shiftKey) {
          this.okButtonNode.focus();
          flag = true;
        }
        break;

      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      default:
        flag = false;
        break;
      }

      break;

    case 'click':
      this.moveToPreviousYear();
      this.setFocusDay(false);
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleNextMonthButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      case 'Enter':
        this.moveToNextMonth();
        this.setFocusDay(false);
        flag = true;
        break;

      default:
        flag = false;
        break;
      }

      break;

    case 'click':
      this.moveToNextMonth();
      this.setFocusDay(false);
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handlePreviousMonthButton(event) {
    let flag = false;

    switch (event.type) {
    case 'keydown':
      switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        flag = true;
        break;

      case 'Enter':
        this.moveToPreviousMonth();
        this.setFocusDay(false);
        flag = true;
        break;

      default:
        flag = false;
        break;
      }

      break;

    case 'click':
      this.moveToPreviousMonth();
      this.setFocusDay(false);
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleDayKeyDown(event) {
    let flag = false;

    switch (event.key) {
    case 'Esc':
    case 'Escape':
      this.close();
      break;

    case ' ':
      this.setTextboxDate(event.currentTarget);
      flag = true;
      break;

    case 'Enter':
      this.setTextboxDate(event.currentTarget);
      this.close();
      flag = true;
      break;

    case 'Tab':
      this.cancelButtonNode.focus();
      if (event.shiftKey) {
        this.nextYearNode.focus();
      }
      this.setMessage('');
      flag = true;
      break;

    case 'Right':
    case 'ArrowRight':
      this.moveFocusToNextDay();
      flag = true;
      break;

    case 'Left':
    case 'ArrowLeft':
      this.moveFocusToPreviousDay();
      flag = true;
      break;

    case 'Down':
    case 'ArrowDown':
      this.moveFocusToNextWeek();
      flag = true;
      break;

    case 'Up':
    case 'ArrowUp':
      this.moveFocusToPreviousWeek();
      flag = true;
      break;

    case 'PageUp':
      if (event.shiftKey) {
        this.moveToPreviousYear();
      } else {
        this.moveToPreviousMonth();
      }
      this.setFocusDay();
      flag = true;
      break;

    case 'PageDown':
      if (event.shiftKey) {
        this.moveToNextYear();
      } else {
        this.moveToNextMonth();
      }
      this.setFocusDay();
      flag = true;
      break;

    case 'Home':
      this.moveFocusToFirstDayOfWeek();
      flag = true;
      break;

    case 'End':
      this.moveFocusToLastDayOfWeek();
      flag = true;
      break;

    default:
      flag = false;
      break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleDayClick(event) {
    if (!this.isDayDisabled(event.currentTarget)) {
      this.setTextboxDate(event.currentTarget);
      this.close();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  handleDayFocus() {
    this.setMessage(this.messageCursorKeys);
  }

  handleButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.open();
      this.setFocusDay();

      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleButtonClick(event) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
      this.setFocusDay();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  handleBackgroundMouseUp(event) {
    if (
      !this.buttonNode.contains(event.target) &&
      !this.dialogNode.contains(event.target)
    ) {
      if (this.isOpen()) {
        this.close(false);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
}
