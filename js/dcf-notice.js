const overlayMatch = 'overlay';
const overlayHeader = 'dcf-header';
const overlayMaincontent = 'dcf-main';
const typeAlert = 'alert';
const typeAffirm = 'affirm';
const typeNegate = 'negate';
const overlayHeaderElement = document.getElementById(overlayHeader);
const overlayMaincontentElement = document.getElementById(overlayMaincontent);

export class DCFNotice {
  initialize() {
    const notices = document.getElementsByClassName('dcf-notice');
    Array.prototype.forEach.call(notices, (notice) => {
      this.initNotice(notice);
    });
  }

  appendNotice(parent, title, message, type = '', overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(title, message, type, overlay);
      parent.append(notice);
    }
    return notice;
  }

  prependNotice(parent, title, message, type = '', overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(title, message, type, overlay);
      parent.prepend(notice);
    }
    return notice;
  }

  createNotice(title, message, type = '', overlay = '') {
    let closeLink = document.createElement('A');
    closeLink.setAttribute('href', '#');
    closeLink.innerText = 'Close this notice';

    let close = document.createElement('DIV');
    close.classList.add('close');
    close.append(closeLink);

    let messageTitle = document.createElement('P');
    messageTitle.classList.add('title');
    messageTitle.innerText = title;

    let messageMsg = document.createElement('P');
    messageMsg.innerHTML = message;

    let messageContainer = document.createElement('DIV');
    messageContainer.classList.add('message');
    messageContainer.append(messageTitle);
    messageContainer.append(messageMsg);

    let notice = document.createElement('DIV');
    notice.classList.add('dcf-notice');

    if (type === typeAffirm || type === typeAlert || type === typeNegate) {
      notice.classList.add(type);
    }

    if (overlay === overlayHeader || overlay === overlayMaincontent) {
      notice.setAttribute('data-overlay', overlay);
    }

    notice.append(close);
    notice.append(messageContainer);

    this.initNotice(notice);

    return notice;
  }

  initNotice(notice) {
    if (!notice.classList.contains('dcf-notice')) {
      return;
    }

    let isOverlay = false;
    let overlayClass = `${overlayMatch}-${overlayHeader}`;
    if (notice.dataset.overlay === overlayHeader || notice.classList.contains(overlayClass)) {
      isOverlay = true;
      notice.classList.add(overlayMatch);
      notice.classList.remove(overlayClass);
      overlayHeaderElement.append(notice);
    }

    overlayClass = `${overlayMatch}-${overlayMaincontent}`;
    if (!isOverlay && (notice.dataset.overlay === overlayMaincontent || notice.classList.contains(overlayClass))) {
      isOverlay = true;
      notice.classList.add(overlayMatch);
      notice.classList.remove(overlayClass);
      overlayMaincontentElement.prepend(notice);
    }

    /* eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }] */
    const handleNoticeClose = () => {
      notice.remove();
    };

    const int0 = 0;
    const close = notice.getElementsByClassName('close');
    if (close[int0]) {
      close[int0].removeEventListener('click', handleNoticeClose);
      close[int0].addEventListener('click', handleNoticeClose);
    }
  }
}
