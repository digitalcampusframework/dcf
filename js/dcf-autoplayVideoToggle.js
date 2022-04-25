export class DCFAutoplayVideoToggleTheme {
  constructor() {
    // Defaults
    /* eslint-disable */
    this.toggleBtnClassList = [ 'dcf-btn-autoplay-video-toggle', 'dcf-btn', 'dcf-btn-primary', 'dcf-z-1', 'dcf-absolute', 'dcf-pin-bottom', 'dcf-pin-right', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-center', 'dcf-mb-3', 'dcf-mr-3', 'dcf-h-7', 'dcf-w-7', 'dcf-p-0', 'dcf-circle' ];
    this.togglePlayBtnInnerHTML = '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498 0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path></svg>';
    this.togglePauseBtnInnerHTML = '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M10.5 0h-5C5.224 0 5 .224 5 .5v23C5 23.776 5.224 24 5.5 24h5c.276 0 .5-.224.5-.5v-23C11 .224 10.776 0 10.5 0zM18.5 0h-5C13.224 0 13 .224 13 .5v23c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-23C19 .224 18.776 0 18.5 0z"></path></svg>';
    /* eslint-enable */
  }

  setThemeVariable(themeVariableName, value) {
    switch (themeVariableName) {
    case 'toggleBtnClassList':
      if (Array.isArray(value)) {
        this.toggleBtnClassList = value;
      }
      break;

    case 'togglePlayBtnInnerHTML':
      if (typeof value === 'string') {
        this.togglePlayBtnInnerHTML = value;
      }
      break;

    case 'togglePauseBtnInnerHTML':
      if (typeof value === 'string') {
        this.togglePauseBtnInnerHTML = value;
      }
      break;

    default:
      // Invalid variable so ignore
      break;
    }
  }
}

export class DCFAutoplayVideoToggle {
  constructor(theme) {
    this.autoplayVideos = [];
    if (theme instanceof DCFAutoplayVideoToggleTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFAutoplayVideoToggleTheme();
    }
  }

  initialize() {
    const toggleEvent = new Event('dcfAutoplayVideoToggle');

    // Add play/pause button to containers
    const autoplayVideoContainers = document.getElementsByClassName('dcf-autoplay-video');
    Array.prototype.forEach.call(autoplayVideoContainers, (container) => {
      let toggleBtn = document.createElement('button');
      // Add theme classes to button
      if (this.theme.toggleBtnClassList) {
        toggleBtn.classList.add(...this.theme.toggleBtnClassList);
      }
      // make sure button always has this class
      toggleBtn.classList.add('dcf-btn-autoplay-video-toggle');

      if (this.isPlaying()) {
        toggleBtn.setAttribute('aria-label', 'pause autoplay video');
        toggleBtn.innerHTML = this.theme.togglePauseBtnInnerHTML;
      } else {
        toggleBtn.setAttribute('aria-label', 'play autoplay video');
        toggleBtn.innerHTML = this.theme.togglePlayBtnInnerHTML;
      }

      toggleBtn.addEventListener('click', () => {
        if (this.isPlaying()) {
          this.pauseAll();
          window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.pausedStatus());
        } else {
          this.playAll();
          window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.playStatus());
        }
        window.dispatchEvent(toggleEvent);
      });
      container.append(toggleBtn);

      window.addEventListener('dcfAutoplayVideoToggle', () => {
        if (this.isPlaying()) {
          // show pause button
          toggleBtn.setAttribute('aria-label', 'pause autoplay video');
          toggleBtn.innerHTML = this.theme.togglePauseBtnInnerHTML;
        } else {
          // show play button
          toggleBtn.setAttribute('aria-label', 'play autoplay video');
          toggleBtn.innerHTML = this.theme.togglePlayBtnInnerHTML;
        }
      });
    });

    const videos = document.getElementsByTagName('video');
    Array.prototype.forEach.call(videos, (video) => {
      if (this.isAutoplayVideo(video)) {
        this.autoplayVideos.push(video);
      }
    });

    if (this.isPlaying()) {
      this.playAll();
      window.localStorage.setItem('dcfAutoplayVideoToggleStatus', this.playStatus());
    } else {
      this.pauseAll();
    }
  }

  playStatus() {
    return 'play';
  }

  pausedStatus() {
    return 'paused';
  }

  isPlaying() {
    return window.localStorage.getItem('dcfAutoplayVideoToggleStatus') !== this.pausedStatus();
  }

  playAll() {
    Array.prototype.forEach.call(this.autoplayVideos, (video) => {
      video.play();
    });
  }

  pauseAll() {
    Array.prototype.forEach.call(this.autoplayVideos, (video) => {
      video.pause();
    });
  }

  isAutoplayVideo(video) {
    return video.hasAttribute('autoplay') && video.hasAttribute('muted') && video.hasAttribute('playsinline');
  }
}
