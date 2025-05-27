import { uuidv4 } from '../dcf-utility.js';

export default class DCFNotice {

    uuid = uuidv4();

    notice = null;

    heading = null;

    icon = null;

    message = null;

    body = null;

    closeButton = null;

    closeNotice = null;

    closeNoticeInfoIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm-.5 4.8c.7 0 1.2.6 1.2 1.2s-.6 1.2-1.2 1.2-1.3-.5-1.3-1.2.6-1.2 1.3-1.2zM15 19.2H9c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h2.2v-7.5H10c-.4 0-.8-.3-.8-.8s.4-.5.8-.5h2c.2 0 .4.1.5.2.1.1.2.3.2.5v8.2H15c.4 0 .8.3.8.8s-.4.7-.8.7z"/></svg>';

    closeNoticeSuccessIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 9L10 16c-.1.1-.3.2-.5.2s-.4-.1-.5-.2l-2.5-2.5c-.1-.1-.2-.3-.2-.5s.1-.4.2-.5c.3-.3.8-.3 1.1 0l2 2 7-6.5c.1-.1.3-.2.5-.2s.4.1.5.2c.2.3.2.8-.1 1z"/></svg>';

    closeNoticeWarningIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M22.9 22.3l-11-22c-.2-.3-.7-.3-.9 0l-11 22c-.1.3.1.7.5.7h22c.4 0 .6-.4.4-.7zM10.8 8.1c0-.4.3-.7.8-.7.2 0 .4.1.5.2.1.1.2.3.2.5v7.7c0 .2-.1.4-.2.5-.1.1-.3.2-.5.2-.4 0-.7-.3-.8-.7V8.1zm.7 12.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z"/></svg>';

    closeNoticeDangerIconInnerHTML = '<svg class="dcf-h-100% dcf-w-100%" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path fill="#fefdfa" d="M23.9 7L17.1.2c-.1-.1-.3-.2-.4-.2H7.2c-.1 0-.2.1-.3.1L.1 7c0 .1-.1.2-.1.3v9.5c0 .1.1.3.1.4l6.7 6.7c.2 0 .3.1.4.1h9.5c.1 0 .3-.1.4-.1l6.8-6.7c.1-.1.1-.2.1-.4V7.3c0-.1-.1-.2-.1-.3zM17 16c.3.3.3.8 0 1.1-.1.1-.3.2-.5.2s-.4-.1-.5-.3l-4-4-4 4c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1l4-4L7 8c-.2-.1-.2-.3-.2-.5s0-.4.2-.5c.3-.3.7-.3 1 0l4 4 4-4c.3-.3.8-.3 1.1 0 .1.1.2.3.2.5s-.1.4-.2.5l-4 4 3.9 4z"/></svg>';

    noticeContainerClassList = [
        'dcf-d-grid',
        'dcf-ai-start',
        'dcf-w-max-xl',
        'dcf-ml-auto',
        'dcf-mr-auto',
        'dcf-mb-6',
        'dcf-rounded',
    ];

    closeNoticeBtnClassList = [
        'dcf-btn',
        'dcf-btn-inverse-tertiary',
        'dcf-lh-1',
    ];

    closeNoticeBtnInnerHTML = '<span class="dcf-sr-only">Close this notice</span><svg class="dcf-fill-current" aria-hidden="true" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M23.707 22.293L13.414 12 23.706 1.707A.999.999 0 1022.292.293L12 10.586 1.706.292A1 1 0 00.292 1.706L10.586 12 .292 22.294a1 1 0 101.414 1.414L12 13.414l10.293 10.292a.999.999 0 101.414-1.413z"/><path fill="none" d="M0 0h24v24H0z"/></svg>';

    typeInfo = 'dcf-notice-info';

    typeSuccess = 'dcf-notice-success';

    typeWarning = 'dcf-notice-warning';

    typeDanger = 'dcf-notice-danger';

    overlayMatch = 'dcf-notice-overlay';

    overlayHeader = 'dcf-header';

    overlayMainContent = 'dcf-main';

    overlayHeaderElement = null;

    overlayMainContentElement = null;

    constructor(notice, options = {}) {
        this.overlayHeaderElement = document.getElementById(this.overlayHeader);
        this.overlayMainContentElement = document.getElementById(this.overlayMainContent);

        if ('closeNoticeInfoIconInnerHTML' in options && typeof options.closeNoticeInfoIconInnerHTML === 'string') {
            this.closeNoticeInfoIconInnerHTML = options.closeNoticeInfoIconInnerHTML;
        }
        if ('closeNoticeSuccessIconInnerHTML' in options && typeof options.closeNoticeSuccessIconInnerHTML === 'string') {
            this.closeNoticeSuccessIconInnerHTML = options.closeNoticeSuccessIconInnerHTML;
        }
        if ('closeNoticeWarningIconInnerHTML' in options && typeof options.closeNoticeWarningIconInnerHTML === 'string') {
            this.closeNoticeWarningIconInnerHTML = options.closeNoticeWarningIconInnerHTML;
        }
        if ('closeNoticeDangerIconInnerHTML' in options && typeof options.closeNoticeDangerIconInnerHTML === 'string') {
            this.closeNoticeDangerIconInnerHTML = options.closeNoticeDangerIconInnerHTML;
        }
        if ('noticeContainerClassList' in options && Array.isArray(options.noticeContainerClassList)) {
            this.noticeContainerClassList = options.noticeContainerClassList;
        }
        if ('closeNoticeBtnClassList' in options && Array.isArray(options.closeNoticeBtnClassList)) {
            this.closeNoticeBtnClassList = options.closeNoticeBtnClassList;
        }
        if ('closeNoticeBtnInnerHTML' in options && typeof options.closeNoticeBtnInnerHTML === 'string') {
            this.closeNoticeBtnInnerHTML = options.closeNoticeBtnInnerHTML;
        }

        this.notice = notice;
        this.notice.classList.add(this.initializing);

        if (this.notice.id === '') {
            this.notice.setAttribute('id', this.uuid.concat('-notice'));
        }
        this.notice.setAttribute('role', 'alertdialog');

        if (
            !this.notice.classList.contains(this.typeInfo) &&
            !this.notice.classList.contains(this.typeSuccess) &&
            !this.notice.classList.contains(this.typeWarning) &&
            !this.notice.classList.contains(this.typeDanger)
        ) {
            this.notice.classList.add(this.typeInfo);
        }

        if (this.noticeContainerClassList) {
            this.notice.classList.add(...this.noticeContainerClassList);
        }

        const allHeadings = notice.getElementsByTagName('h2');
        this.heading = allHeadings[0] || document.createElement('h2');
        this.heading.classList.add('dcf-notice-heading', 'dcf-txt-h6', 'dcf-mb-0');
        if (this.heading.id === '') {
            this.heading.setAttribute('id', this.uuid.concat('-notice-heading'));
        }
        this.notice.setAttribute('aria-labelledby', this.heading.id);

        this.icon = document.createElement('div');
        this.icon.classList.add('dcf-notice-icon');
        this.icon.innerHTML = this.#getNoticeIconContent();

        // set notice message
        const allMessages = notice.getElementsByTagName('div');
        this.message = document.createElement('div');
        if (allMessages[0]) {
            this.message = allMessages[0].cloneNode(true);
        }
        this.message.classList.add('dcf-notice-message', 'dcf-txt-sm');

        // build notice body
        this.body = document.createElement('div');
        this.body.classList.add('dcf-notice-body');
        this.body.append(this.heading);
        this.body.append(this.message);

        // set notice icon and body
        this.notice.innerHTML = '';
        this.notice.append(this.icon);
        this.notice.append(this.body);

        let isOverlay = false;
        let overlayClass = `${this.overlayMatch}-${this.overlayHeader}`;
        if (
            this.notice.dataset.overlay === this.overlayHeader ||
            this.notice.classList.contains(overlayClass)
        ) {
            isOverlay = true;
            this.notice.classList.add('dcf-absolute');
            this.notice.classList.add(this.overlayMatch);
            this.notice.classList.remove(overlayClass);
            this.overlayHeaderElement.append(this.notice);
        }

        overlayClass = `${this.overlayMatch}-${this.overlayMainContent}`;
        if (!isOverlay && (this.notice.dataset.overlay === this.overlayMainContent || this.notice.classList.contains(overlayClass))) {
            isOverlay = true;
            this.notice.classList.add('dcf-absolute');
            this.notice.classList.add(this.overlayMatch);
            this.notice.classList.remove(overlayClass);
            this.overlayMainContentElement.prepend(this.notice);
        }

        const handleNoticeClose = () => {
            this.notice.remove();
        };

        // Add close button unless data-no-close-button exists
        if (this.notice.dataset.noCloseButton === undefined) {
            this.closeButton = document.createElement('button');
            if (this.closeNoticeBtnClassList) {
                this.closeButton.classList.add(...this.closeNoticeBtnClassList);
            }
            if (this.closeNoticeBtnInnerHTML) {
                this.closeButton.innerHTML = this.closeNoticeBtnInnerHTML;
            }
            this.closeButton.removeEventListener('click', handleNoticeClose);
            this.closeButton.addEventListener('click', handleNoticeClose);

            this.closeNotice = document.createElement('div');
            this.closeNotice.classList.add('dcf-notice-close');
            this.closeNotice.append(this.closeButton);

            this.notice.append(this.closeNotice);
        }

        this.notice.classList.add('dcf-notice-initialized');
        this.notice.removeAttribute('hidden');

        this.notice.dispatchEvent(new CustomEvent(DCFNotice.events('noticeReady'), {
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
            noticeReady: 'noticeReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #getNoticeIconContent() {
        let iconContent = this.closeNoticeInfoIconInnerHTML;
        if (this.notice.classList.contains(this.typeSuccess)) {
            iconContent = this.closeNoticeSuccessIconInnerHTML;
        } else if (this.notice.classList.contains(this.typeWarning)) {
            iconContent = this.closeNoticeWarningIconInnerHTML;
        } else if (this.notice.classList.contains(this.typeDanger)) {
            iconContent = this.closeNoticeDangerIconInnerHTML;
        }
        return iconContent;
    }
}
