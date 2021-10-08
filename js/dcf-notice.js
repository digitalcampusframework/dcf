import { DCFUtility } from './dcf-utility';

const overlayMatch = 'overlay';
const overlayHeader = 'dcf-header';
const overlayMaincontent = 'dcf-main';
const typeAlert = 'dcf-notice-alert';
const typeAffirm = 'dcf-notice-affirm';
const typeNegate = 'dcf-notice-negate';
const overlayHeaderElement = document.getElementById(overlayHeader);
const overlayMaincontentElement = document.getElementById(overlayMaincontent);

const getCloseButton = (notice) => {
  /* eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }] */
  const handleNoticeClose = () => {
    notice.remove();
  };

  let closeSROnly = document.createElement('span');
  closeSROnly.classList.add('dcf-sr-only');
  closeSROnly.innerText = 'Close this notice';

  let closeSVG = document.createElement('svg');
  closeSVG.classList.add('dcf-fill-current');
  closeSVG.setAttribute('aria-hidden', 'true');
  closeSVG.setAttribute('focusable', 'false');
  closeSVG.setAttribute('height', '16');
  closeSVG.setAttribute('width', '16');
  closeSVG.setAttribute('viewBox', '0 0 24 24');
  const path1 = '<path d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"></path>';
  const path2 = '<path d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"></path>';
  closeSVG.innerHTML = `${path1}${path2}`;

  let closeButton = document.createElement('button');
  closeButton.classList.add('dcf-btn', 'dcf-btn-tertiary');
  closeButton.removeEventListener('click', handleNoticeClose);
  closeButton.addEventListener('click', handleNoticeClose);
  closeButton.append(closeSROnly);
  closeButton.append(closeSVG);

  return closeButton;
};

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
    let noticeTitle = document.createElement('h2');
    noticeTitle.innerText = title;

    let noticeMsg = document.createElement('P');
    noticeMsg.innerHTML = message;

    let notice = document.createElement('DIV');
    notice.classList.add('dcf-notice');

    if (type === typeAffirm || type === typeAlert || type === typeNegate) {
      notice.classList.add(type);
    }

    if (overlay === overlayHeader || overlay === overlayMaincontent) {
      notice.setAttribute('data-overlay', overlay);
    }

    notice.append(noticeTitle);
    notice.append(noticeMsg);

    this.initNotice(notice);

    return notice;
  }

  initNotice(notice) {
    if (!notice.classList.contains('dcf-notice')) {
      return;
    }

    const int0 = 0;

    // Get or Set notice id info
    const idPrefix = 'dcf-notice-';
    notice.setAttribute('id', DCFUtility.checkSetElementId(notice, idPrefix.concat(DCFUtility.uuidv4())));
    const titleId = `${notice.getAttribute('id')}-title`;

    // Add other notice attributes
    notice.setAttribute('role', 'alertdialog');
    notice.setAttribute('aria-labelledby', titleId);

    // set notice title
    const titles = notice.getElementsByTagName('h2');
    const title = titles[int0] || document.createElement('h2');
    title.setAttribute('id', titleId);
    title.classList.add('dcf-notice-title');

    // set notice message
    const messages = notice.getElementsByTagName('p');
    const message = messages[int0] || document.createElement('p');
    message.classList.add('dcf-notice-message');

    // build notice body
    const noticeBody = document.createElement('div');
    noticeBody.classList.add('dcf-notice-body');
    noticeBody.append(title);
    noticeBody.append(message);

    // set notice body
    notice.innerHTML = '';
    notice.append(noticeBody);

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

    let closeNotice = document.createElement('div');
    closeNotice.classList.add('dcf-notice-close');
    closeNotice.append(getCloseButton(notice));
    notice.append(closeNotice);
  }
}
