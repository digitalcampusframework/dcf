import { DCFUtility } from './dcf-utility';

const overlayMatch = 'dcf-notice-overlay';
const overlayHeader = 'dcf-header';
const overlayMaincontent = 'dcf-main';
const typeInfo = 'dcf-notice-info';
const typeSuccess = 'dcf-notice-success';
const typeWarning = 'dcf-notice-warning';
const typeDanger = 'dcf-notice-danger';
const overlayHeaderElement = document.getElementById(overlayHeader);
const overlayMaincontentElement = document.getElementById(overlayMaincontent);

export class DCFNoticeTheme {
  constructor() {
    // Defaults
    /* eslint-disable */
    this.noticeContainerClassList = [ 'dcf-d-grid', 'dcf-w-max-xl', 'dcf-ml-auto', 'dcf-mr-auto', 'dcf-mb-6', 'dcf-rounded' ];
    this.closeNoticeInfoIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm-.5 4.8c.7 0 1.2.6 1.2 1.2s-.6 1.2-1.2 1.2-1.3-.5-1.3-1.2.6-1.2 1.3-1.2zM15 19.2H9c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h2.2v-7.5H10c-.4 0-.8-.3-.8-.8s.4-.5.8-.5h2c.2 0 .4.1.5.2.1.1.2.3.2.5v8.2H15c.4 0 .8.3.8.8s-.4.7-.8.7z"/></svg>';
    this.closeNoticeSuccessIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 9L10 16c-.1.1-.3.2-.5.2s-.4-.1-.5-.2l-2.5-2.5c-.1-.1-.2-.3-.2-.5s.1-.4.2-.5c.3-.3.8-.3 1.1 0l2 2 7-6.5c.1-.1.3-.2.5-.2s.4.1.5.2c.2.3.2.8-.1 1z"/></svg>';
    this.closeNoticeWarningIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M22.9 22.3l-11-22c-.2-.3-.7-.3-.9 0l-11 22c-.1.3.1.7.5.7h22c.4 0 .6-.4.4-.7zM10.8 8.1c0-.4.3-.7.8-.7.2 0 .4.1.5.2.1.1.2.3.2.5v7.7c0 .2-.1.4-.2.5-.1.1-.3.2-.5.2-.4 0-.7-.3-.8-.7V8.1zm.7 12.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z"/></svg>';
    this.closeNoticeDangerIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M23.9 7L17.1.2c-.1-.1-.3-.2-.4-.2H7.2c-.1 0-.2.1-.3.1L.1 7c0 .1-.1.2-.1.3v9.5c0 .1.1.3.1.4l6.7 6.7c.2 0 .3.1.4.1h9.5c.1 0 .3-.1.4-.1l6.8-6.7c.1-.1.1-.2.1-.4V7.3c0-.1-.1-.2-.1-.3zM17 16c.3.3.3.8 0 1.1-.1.1-.3.2-.5.2s-.4-.1-.5-.3l-4-4-4 4c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1l4-4L7 8c-.2-.1-.2-.3-.2-.5s0-.4.2-.5c.3-.3.7-.3 1 0l4 4 4-4c.3-.3.8-.3 1.1 0 .1.1.2.3.2.5s-.1.4-.2.5l-4 4 3.9 4z"/></svg>';
    this.closeNoticeBtnClassList = [ 'dcf-btn', 'dcf-btn-inverse-tertiary', 'dcf-lh-1' ];
    this.closeNoticeBtnInnerHTML = '<span class="dcf-sr-only">Close this notice</span><svg class="dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M23.707 22.293L13.414 12 23.706 1.707A.999.999 0 1022.292.293L12 10.586 1.706.292A1 1 0 00.292 1.706L10.586 12 .292 22.294a1 1 0 101.414 1.414L12 13.414l10.293 10.292a.999.999 0 101.414-1.413z"/><path fill="none" d="M0 0h24v24H0z"/></svg>';
    /* eslint-enable */
  }

  setThemeVariable(themeVariableName, value) {
    switch (themeVariableName) {
    case 'noticeContainerClassList':
      if (Array.isArray(value)) {
        this.noticeContainerClassList = value;
      }
      break;

    case 'closeNoticeInfoIconInnerHTML':
      if (typeof value === 'string') {
        this.closeNoticeInfoIconInnerHTML = value;
      }
      break;

    case 'closeNoticeSuccessIconInnerHTML':
      if (typeof value === 'string') {
        this.closeNoticeSuccessIconInnerHTML = value;
      }
      break;

    case 'closeNoticeWarningIconInnerHTML':
      if (typeof value === 'string') {
        this.closeNoticeWarningIconInnerHTML = value;
      }
      break;

    case 'closeNoticeDangerIconInnerHTML':
      if (typeof value === 'string') {
        this.closeNoticeDangerIconInnerHTML = value;
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

  appendNotice(parent, heading, message, type = typeInfo, overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(heading, message, type, overlay);
      parent.append(notice);
    }
    return notice;
  }

  prependNotice(parent, heading, message, type = typeInfo, overlay = '') {
    let notice = false;
    if (parent instanceof Element) {
      notice = this.createNotice(heading, message, type, overlay);
      parent.prepend(notice);
    }
    return notice;
  }

  createNotice(heading, message, type = typeInfo, overlay = '') {
    let noticeHeading = document.createElement('h2');
    noticeHeading.innerText = heading;

    let noticeMsg = document.createElement('P');
    noticeMsg.innerHTML = message;

    let notice = document.createElement('DIV');
    notice.classList.add('dcf-notice');

    if (type === typeInfo || type === typeSuccess || type === typeWarning || type === typeDanger) {
      notice.classList.add(type);
    } else {
      notice.classList.add(typeInfo);
    }

    if (overlay === overlayHeader || overlay === overlayMaincontent) {
      notice.setAttribute('data-overlay', overlay);
    }

    notice.append(noticeHeading);
    notice.append(noticeMsg);

    this.initNotice(notice);

    return notice;
  }

  getNoticeIconContent(notice) {
    let iconContent = this.theme.closeNoticeInfoIconInnerHTML;
    if (notice.classList.contains(typeSuccess)) {
      iconContent = this.theme.closeNoticeSuccessIconInnerHTML;
    } else if (notice.classList.contains(typeWarning)) {
      iconContent = this.theme.closeNoticeWarningIconInnerHTML;
    } else if (notice.classList.contains(typeDanger)) {
      iconContent = this.theme.closeNoticeDangerIconInnerHTML;
    }
    return iconContent;
  }

  initNotice(notice) {
    if (!notice.classList.contains('dcf-notice') || notice.classList.contains('dcf-notice-initialized')) {
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

    if (!notice.classList.contains(typeInfo) && !notice.classList.contains(typeSuccess) &&
      !notice.classList.contains(typeWarning) && !notice.classList.contains(typeDanger)) {
      notice.classList.add(typeInfo);
    }

    if (this.theme.noticeContainerClassList) {
      notice.classList.add(...this.theme.noticeContainerClassList);
    }

    // set notice icon
    const noticeIcon = document.createElement('div');
    noticeIcon.classList.add('dcf-notice-icon');
    noticeIcon.innerHTML = this.getNoticeIconContent(notice);

    // set notice heading
    const headings = notice.getElementsByTagName('h2');
    const heading = headings[int0] || document.createElement('h2');
    heading.classList.add('dcf-notice-heading', 'dcf-txt-h6', 'dcf-mb-0');
    heading.setAttribute('id', headingId);

    // set notice message
    const messages = notice.getElementsByTagName('p');
    const message = document.createElement('div');
    const messageContent = messages[int0] || document.createElement('p');
    message.classList.add('dcf-notice-message', 'dcf-txt-sm');
    message.append(messageContent);

    // build notice body
    const noticeBody = document.createElement('div');
    noticeBody.classList.add('dcf-notice-body');
    noticeBody.append(heading);
    noticeBody.append(message);

    // set notice icon and body
    notice.innerHTML = '';
    notice.append(noticeIcon);
    notice.append(noticeBody);

    let isOverlay = false;
    let overlayClass = `${overlayMatch}-${overlayHeader}`;
    if (notice.dataset.overlay === overlayHeader || notice.classList.contains(overlayClass)) {
      isOverlay = true;
      notice.classList.add('dcf-absolute');
      notice.classList.add(overlayMatch);
      notice.classList.remove(overlayClass);
      overlayHeaderElement.append(notice);
    }

    overlayClass = `${overlayMatch}-${overlayMaincontent}`;
    if (!isOverlay && (notice.dataset.overlay === overlayMaincontent || notice.classList.contains(overlayClass))) {
      isOverlay = true;
      notice.classList.add('dcf-absolute');
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
    closeNotice.append(closeButton);

    notice.append(closeNotice);

    notice.classList.add('dcf-notice-initialized');
    notice.removeAttribute('hidden');
  }
}
