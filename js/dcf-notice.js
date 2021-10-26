import { DCFUtility } from './dcf-utility';

const overlayMatch = 'overlay';
const overlayHeader = 'dcf-header';
const overlayMaincontent = 'dcf-main';
const typeAlert = 'dcf-notice-alert';
const typeAffirm = 'dcf-notice-affirm';
const typeNegate = 'dcf-notice-negate';
const overlayHeaderElement = document.getElementById(overlayHeader);
const overlayMaincontentElement = document.getElementById(overlayMaincontent);

export class DCFNoticeTheme {
  constructor() {
    // Defaults
    this.noticeContainerClassList = [ 'dcf-relative', 'dcf-w-max-xl', 'dcf-ml-auto', 'dcf-mr-auto', 'dcf-mb-6', 'dcf-rounded' ];
    this.closeNoticeContainerClassList = [ 'dcf-absolute', 'dcf-pin-top', 'dcf-pin-right' ];
    this.closeNoticeBtnClassList = [ 'dcf-btn', 'dcf-btn-inverse-tertiary', 'dcf-lh-1' ];
    this.closeNoticeBtnInnerHTML = `<span class="dcf-sr-only">Close this notice</span>
<svg class="dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24">
   <path d="M23.707 22.293L13.414 12 23.706 1.707A.999.999 0 1022.292.293L12 10.586 1.706.292A1 1 0 00.292
         1.706L10.586 12 .292 22.294a1 1 0 101.414 1.414L12 13.414l10.293 10.292a.999.999 0 101.414-1.413z"/>
   <path fill="none" d="M0 0h24v24H0z"/>
</svg>`;
  }

  setThemeVariable(themeVariableName, value) {
    switch (themeVariableName) {
    case 'noticeContainerClassList':
      if (Array.isArray(value)) {
        this.noticeContainerClassList = value;
      }
      break;

    case 'closeNoticeContainerClassList':
      if (Array.isArray(value)) {
        this.closeNoticeContainerClassList = value;
      }
      break;

    case 'closeNoticeBtnClassList':
      if (Array.isArray(value)) {
        this.closeNoticeBtnClassList = value;
      }
      break;

    case 'closeNoticeBtnInnerHTML':
      if (typeof value === 'string') {
        this.closeNoticeBtnInnerHTML = value;
      }
      break;

    default:
      // Invalid variable so ignore
      break;
    }
  }
}

export class DCFNotice {
  constructor(theme) {
    if (theme instanceof DCFNoticeTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFNoticeTheme();
    }
  }

  initialize() {
    const notices = document.getElementsByClassName('dcf-notice');
    Array.prototype.forEach.call(notices, (notice) => {
      this.initNotice(notice);
    });
  }

  appendNotice(parent, heading, message, type = '', overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(heading, message, type, overlay);
      parent.append(notice);
    }
    return notice;
  }

  prependNotice(parent, heading, message, type = '', overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(heading, message, type, overlay);
      parent.prepend(notice);
    }
    return notice;
  }

  createNotice(heading, message, type = '', overlay = '') {
    let noticeHeading = document.createElement('h2');
    noticeHeading.innerText = heading;

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

    notice.append(noticeHeading);
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
    const headingId = `${notice.getAttribute('id')}-heading`;

    // Add other notice attributes
    notice.setAttribute('role', 'alertdialog');
    notice.setAttribute('aria-labelledby', headingId);

    if (this.theme.noticeContainerClassList) {
      notice.classList.add(...this.theme.noticeContainerClassList);
    }

    // set notice heading
    const headings = notice.getElementsByTagName('h2');
    const heading = headings[int0] || document.createElement('h2');
    heading.classList.add('dcf-notice-heading', 'dcf-txt-h6', 'dcf-mb-0');
    heading.setAttribute('id', headingId);

    // set notice message
    const messages = notice.getElementsByTagName('p');
    const message = messages[int0] || document.createElement('p');
    message.classList.add('dcf-notice-message', 'dcf-txt-sm');

    // build notice body
    const noticeBody = document.createElement('div');
    noticeBody.classList.add('dcf-notice-body');
    noticeBody.append(heading);
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

    /* eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }] */
    const handleNoticeClose = () => {
      notice.remove();
    };

    let closeButton = document.createElement('button');
    if (this.theme.closeNoticeBtnClassList) {
      closeButton.classList.add(...this.theme.closeNoticeBtnClassList);
    }
    if (this.theme.closeNoticeBtnInnerHTML) {
      closeButton.innerHTML = this.theme.closeNoticeBtnInnerHTML;
    }
    closeButton.removeEventListener('click', handleNoticeClose);
    closeButton.addEventListener('click', handleNoticeClose);

    let closeNotice = document.createElement('div');
    closeNotice.classList.add('dcf-notice-close');
    if (this.theme.closeNoticeContainerClassList) {
      closeNotice.classList.add(...this.theme.closeNoticeContainerClassList);
    }
    closeNotice.append(closeButton);
    notice.append(closeNotice);
  }
}
