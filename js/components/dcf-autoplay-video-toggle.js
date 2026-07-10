import { uuidv4 } from '../dcf-utility.js';

export default class DCFAutoplayVideoToggle {

    uuid = uuidv4();

    autoplayVideoContainer = null;

    video = null;

    toggleButton = null;

    autoplayVideos = [];

    videoContainerClassList = [
        'dcf-relative',
    ];

    toggleBtnClassList = [
        'dcf-btn-autoplay-video-toggle',
        'dcf-btn',
        'dcf-btn-primary',
        'dcf-z-1',
        'dcf-absolute',
        'dcf-bottom-0',
        'dcf-right-0',
        'dcf-d-flex',
        'dcf-ai-center',
        'dcf-jc-center',
        'dcf-mb-3',
        'dcf-mr-3',
        'dcf-h-7',
        'dcf-w-7',
        'dcf-circle',
    ];

    togglePlayBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498 0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path>
</svg>`;

    togglePauseBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M10.5 0h-5C5.224 0 5 .224 5 .5v23C5 23.776 5.224 24 5.5 24h5c.276 0 .5-.224.5-.5v-23C11 .224 10.776 0 10.5 0zM18.5 0h-5C13.224 0 13 .224 13 .5v23c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-23C19 .224 18.776 0 18.5 0z"></path>
</svg>`;

    toggleEvent = new Event('dcfAutoplayVideoToggle');


    constructor(autoPlayVideoContainer, options = {}) {
        if ('videoContainerClassList' in options && Array.isArray(options.videoContainerClassList)) {
            this.videoContainerClassList = options.videoContainerClassList;
        }
        if ('toggleBtnClassList' in options && Array.isArray(options.toggleBtnClassList)) {
            this.toggleBtnClassList = options.toggleBtnClassList;
        }
        if ('togglePlayBtnInnerHTML' in options && typeof options.togglePlayBtnInnerHTML === 'string') {
            this.togglePlayBtnInnerHTML = options.togglePlayBtnInnerHTML;
        }
        if ('togglePauseBtnInnerHTML' in options && typeof options.togglePauseBtnInnerHTML === 'string') {
            this.togglePauseBtnInnerHTML = options.togglePauseBtnInnerHTML;
        }

        this.autoplayVideoContainer = autoPlayVideoContainer;
        if (this.autoplayVideoContainer.getAttribute('id') === '' || this.autoplayVideoContainer.getAttribute('id') === null) {
            this.autoplayVideoContainer.setAttribute('id', this.uuid.concat('-autoplay-video'));
        }

        if (this.videoContainerClassList) {
            this.autoplayVideoContainer.classList.add(...this.videoContainerClassList);
        }

        this.toggleButton = document.createElement('button');

        // Add theme classes to button
        if (this.toggleBtnClassList) {
            this.toggleButton.classList.add(...this.toggleBtnClassList);
        }

        // make sure button always has this class
        this.toggleButton.classList.add('dcf-btn-autoplay-video-toggle');

        if (this.isPlaying()) {
            this.toggleButton.setAttribute('aria-label', 'pause autoplay video');
            this.toggleButton.innerHTML = this.togglePauseBtnInnerHTML;
        } else {
            this.toggleButton.setAttribute('aria-label', 'play autoplay video');
            this.toggleButton.innerHTML = this.togglePlayBtnInnerHTML;
        }

        this.toggleButton.addEventListener('click', () => {
            if (this.isPlaying()) {
                this.pauseAll();
            } else {
                this.playAll();
            }
            window.dispatchEvent(this.toggleEvent);
        });
        this.autoplayVideoContainer.append(this.toggleButton);

        window.addEventListener(DCFAutoplayVideoToggle.events('dcfAutoplayVideoToggle'), () => {
            if (this.isPlaying()) {
                // show pause button
                this.toggleButton.setAttribute('aria-label', 'pause autoplay video');
                this.toggleButton.innerHTML = this.togglePauseBtnInnerHTML;
            } else {
                // show play button
                this.toggleButton.setAttribute('aria-label', 'play autoplay video');
                this.toggleButton.innerHTML = this.togglePlayBtnInnerHTML;
            }
        });

        const videos = Array.from(document.getElementsByTagName('video'));
        videos.forEach((video) => {
            if (this.#isAutoplayVideo(video)) {
                this.autoplayVideos.push(video);
            }
        });

        if (this.isPlaying()) {
            this.playAll();
            window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.#playStatus());
        } else {
            this.pauseAll();
        }

        this.autoplayVideoContainer.classList.add('dcf-autoplay-video-initialized');
        this.autoplayVideoContainer.removeAttribute('hidden');

        this.autoplayVideoContainer.dispatchEvent(new CustomEvent(DCFAutoplayVideoToggle.events('autoplayVideoReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            autoplayVideoReady: 'autoplayVideoReady',
            dcfAutoplayVideoToggle: 'dcfAutoplayVideoToggle',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #playStatus() {
        return 'play';
    }

    #pausedStatus() {
        return 'paused';
    }

    isPlaying() {
        return window.localStorage.getItem('dcfAutoplayVideoToggleStatus') !== this.#pausedStatus();
    }

    playAll() {
        this.autoplayVideos.forEach((video) => {
            video.play();
        });
        window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.#playStatus());
        window.dispatchEvent(this.toggleEvent);
    }

    pauseAll() {
        this.autoplayVideos.forEach((video) => {
            video.pause();
        });
        window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.#pausedStatus());
        window.dispatchEvent(this.toggleEvent);
    }

    #isAutoplayVideo(video) {
        return video.hasAttribute('autoplay') && video.hasAttribute('muted') && video.hasAttribute('playsinline');
    }
}
