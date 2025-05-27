import { uuidv4 } from '../dcf-utility.js';
import DCFDialog from './dcf-dialog';

let sharedDialog = null;

export default class DCFGallery {
    uuid = uuidv4();

    image = null;

    dialog = null;

    // Set up the button
    constructor(galleryImage, options={}) {
        if (sharedDialog === null) {
            sharedDialog = new DCFGalleryDialog(options);
        }
        this.dialog = sharedDialog;

        this.image = galleryImage;
        this.image.addEventListener('click', () => {
            this.dialog.open(this.image);
        });

        this.image.dispatchEvent(new CustomEvent(DCFGallery.events('galleryReady'), {
            detail: {
                classInstance: this,
                galleryDialogInstance: sharedDialog,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
            galleryReady: 'galleryReady',
        };
        Object.freeze(events);

        // Forward the events from the DCFDialog
        if (DCFDialog.events(name) !== undefined) {
            return DCFDialog.events(name);
        }

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }
}

export class DCFGalleryDialog {

    dialogElement = null;

    nextButton = null;

    prevButton = null;

    thumbnailListElement = null;

    figureElement = null;

    selectedIndex = -1;

    constructor() {
        this.dialogElement = document.createElement('dialog');
        this.dialogElement.classList.add('dcf-dialog');
        this.dialogElement.setAttribute('id', 'dcf-gallery-dialog');
        this.dialogElement.innerHTML = `<div class="dcf-dialog-header">
    <h2 class="dcf-sr-only">Image Gallery</h2>
    <button class="dcf-btn-close-dialog dcf-btn dcf-btn-tertiary">Close</button>
</div>
<div class="dcf-dialog-content dcf-modal-content-gallery dcf-flex-grow-1 dcf-d-grid">
    <div class="dcf-gallery-prev dcf-d-flex dcf-ai-center">
        <button class="dcf-btn dcf-btn-secondary dcf-gallery-btn-prev dcf-d-flex dcf-jc-center dcf-ai-center dcf-h-7 dcf-w-7 dcf-circle" style="padding: 0px;">
            <span class="dcf-sr-only">Previous Image</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="dcf-fill-current dcf-h-4 dcf-w-4 dcf-d-block" style="rotate: 180deg;" viewBox="0 0 30 36">
            <path d="M25.5,15.3L9.3,0.9C8.6,0.3,7.6,0,6.7,0c-1,0.1-1.9,0.5-2.5,1.2
            C3.5,2,3.2,2.9,3.3,3.8c0.1,1,0.5,1.9,1.2,2.5L17.7,18
            L4.5,29.7c-0.7,0.6-1.2,1.5-1.2,2.5c-0.1,1,0.3,1.9,0.9,2.6
            C4.8,35.5,5.8,36,6.9,36c0.9,0,1.7-0.3,2.4-0.9l16.3-14.4
            c0.8-0.7,1.2-1.7,1.2-2.7S26.3,16,25.5,15.3z"/>
            </svg>
        </button>
    </div>
    <div class="dcf-gallery-next dcf-d-flex dcf-ai-center">
        <button class="dcf-btn dcf-btn-secondary dcf-gallery-btn-next dcf-d-flex dcf-jc-center dcf-ai-center dcf-h-7 dcf-w-7 dcf-circle" style="padding: 0px;">
            <span class="dcf-sr-only">Next Image</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="dcf-fill-current dcf-h-4 dcf-w-4 dcf-d-block" viewBox="0 0 30 36">
                <path d="M25.5,15.3L9.3,0.9C8.6,0.3,7.6,0,6.7,0c-1,0.1-1.9,0.5-2.5,1.2
                C3.5,2,3.2,2.9,3.3,3.8c0.1,1,0.5,1.9,1.2,2.5L17.7,18
                L4.5,29.7c-0.7,0.6-1.2,1.5-1.2,2.5c-0.1,1,0.3,1.9,0.9,2.6
                C4.8,35.5,5.8,36,6.9,36c0.9,0,1.7-0.3,2.4-0.9l16.3-14.4
                c0.8-0.7,1.2-1.7,1.2-2.7S26.3,16,25.5,15.3z"/>
            </svg>
        </button>
    </div>
    <div class="dcf-gallery-thumbnails dcf-overflow-y-hidden dcf-overflow-x-auto">
        <ul class="dcf-gallery-thumbnails-list dcf-d-flex dcf-flex-nowrap dcf-mb-0" aria-label="images" role="tablist">
        </ul>
    </div>
    <figure class="dcf-gallery-figure dcf-d-flex dcf-flex-col dcf-ai-center dcf-jc-center" role="tabpanel" aria-live="polite">
    </figure>
</div>`;
        document.body.append(this.dialogElement);
        new DCFDialog(this.dialogElement, {
            dialogElementClassList: [
                'dcf-p-0',
                'dcf-b-0',
                'dcf-d-flex',
                'dcf-flex-col',
                'dcf-m-auto',
            ],
            dialogContentElementClassList: [],
        });

        this.thumbnailListElement = this.dialogElement.querySelector('.dcf-gallery-thumbnails-list');
        this.figureElement = this.dialogElement.querySelector('.dcf-gallery-figure');

        this.prevButton = this.dialogElement.querySelector('.dcf-gallery-prev button');
        this.prevButton.addEventListener('click', () => {
            this.prevImage();
        });
        this.nextButton = this.dialogElement.querySelector('.dcf-gallery-next button');
        this.nextButton.addEventListener('click', () => {
            this.nextImage();
        });
    }

    open(imageClicked=null) {
        const allImages = document.querySelectorAll('.dcf-gallery-img');
        allImages.forEach((image, index) => {
            if (image.isSameNode(imageClicked)) {
                this.selectedIndex = index;
            }
            this.#addNewImage(image, image.isSameNode(imageClicked));
        });

        this.#replaceMainImage();
        this.dialogElement.dispatchEvent(new Event('commandOpen'));
        this.#focusOnSelectedImage();
    }

    close() {
        this.dialogElement.dispatchEvent(new Event('commandClose'));
    }

    toggle() {
        this.dialogElement.dispatchEvent(new Event('commandToggle'));
    }

    nextImage() {
        this.selectedIndex += 1;
        if (this.selectedIndex >= this.thumbnailListElement.children.length) {
            this.selectedIndex = 0;
        }
        this.#updateSelectedImage();
        this.#replaceMainImage();
    }

    prevImage() {
        this.selectedIndex -= 1;
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.thumbnailListElement.children.length - 1;
        }
        this.#updateSelectedImage();
        this.#replaceMainImage();
    }

    goToImage(newIndex) {
        this.selectedIndex = parseInt(newIndex, 10);
        if (isNaN(this.selectedIndex)) {
            this.selectedIndex = 0;
        } else if (this.selectedIndex < 0) {
            this.selectedIndex = this.thumbnailListElement.children.length - 1;
        } else if (this.selectedIndex >= this.thumbnailListElement.children.length) {
            this.selectedIndex = 0;
        }
        this.#updateSelectedImage();
        this.#replaceMainImage();
    }

    #replaceMainImage() {
        const selectedImage = this.thumbnailListElement.querySelector('li[aria-selected="true"] img');
        this.figureElement.innerHTML = `<div class="dcf-gallery-img-box dcf-d-flex dcf-ai-center dcf-jc-center dcf-overflow-auto">
    ${selectedImage.outerHTML}
</div>
<figcaption class="dcf-gallery-figcaption dcf-figcaption dcf-flex-shrink-0">
    <span class="dcf-gallery-img-cutline">
    ${selectedImage.dataset.cutline || ''}
    </span>
    <small class="dcf-gallery-img-credit">
    ${selectedImage.dataset.credit || ''}
    </small>
</figcaption>`;
    }

    #addNewImage(imageElement, selected=false) {
        const newLi = document.createElement('li');
        newLi.classList.add('dcf-flex-shrink-0', 'dcf-mb-0');
        newLi.setAttribute('role', 'tab');
        newLi.setAttribute('aria-selected', selected ? 'true' : 'false');

        // We do plus one since we haven't added the item to the list yet and we want to human readable number
        newLi.setAttribute('aria-label', `image ${this.thumbnailListElement.children.length + 1}`);
        newLi.setAttribute('tabindex', selected ? '0' : '-1');
        newLi.innerHTML = `<div class="dcf-1x1 dcf-w-9 dcf-rounded">
    <img
        class="dcf-d-block"
        ${imageElement.getAttribute('src') !== null ? `src='${imageElement.getAttribute('src')}'` : ''}
        ${imageElement.getAttribute('srcset') !== null ? `srcset='${imageElement.getAttribute('srcset')}'` : ''}
        ${imageElement.getAttribute('crossorigin') !== null ? `crossorigin='${imageElement.getAttribute('crossorigin')}'` : ''}
        ${imageElement.getAttribute('height') !== null ? `height='${imageElement.getAttribute('height')}'` : ''}
        ${imageElement.getAttribute('sizes') !== null ? `sizes='${imageElement.getAttribute('sizes')}'` : ''}
        ${imageElement.getAttribute('width') !== null ? `width='${imageElement.getAttribute('width')}'` : ''}
        ${imageElement.getAttribute('data-cutline') !== null ? `data-cutline='${imageElement.getAttribute('data-cutline')}'` : ''}
        ${imageElement.getAttribute('data-credit') !== null ? `data-credit='${imageElement.getAttribute('data-credit')}'` : ''}
    >
</div>`;
        this.thumbnailListElement.append(newLi);
        const currentIndex = this.thumbnailListElement.children.length - 1;

        newLi.addEventListener('click', () => {
            // We do minus one since we have added the item to the list and we want to index in the array
            this.goToImage(currentIndex);
        });

        newLi.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowRight') {
                this.nextImage();
                this.#focusOnSelectedImage();
            }
            if (event.code === 'ArrowLeft') {
                this.prevImage();
                this.#focusOnSelectedImage();
            }
            if (event.code === 'Home') {
                this.goToImage(0);
                this.#focusOnSelectedImage();
            }
            if (event.code === 'End') {
                this.goToImage(this.thumbnailListElement.children.length - 1);
                this.#focusOnSelectedImage();
            }
        });
    }

    #updateSelectedImage() {
        const thumbnailImages = Array.from(this.thumbnailListElement.children);
        thumbnailImages.forEach((singleThumbnailImage, index) => {
            if (this.selectedIndex !== index) {
                this.#unselectImage(singleThumbnailImage);
            } else {
                this.#selectImage(singleThumbnailImage);
            }
        });
    }

    #focusOnSelectedImage() {
        const thumbnailImages = Array.from(this.thumbnailListElement.children);
        thumbnailImages[this.selectedIndex].focus();
    }

    #selectImage(thumbnailImageElement) {
        thumbnailImageElement.setAttribute('aria-selected', 'true');
        thumbnailImageElement.setAttribute('tabindex', '0');
        thumbnailImageElement.scrollIntoView({
            'behavior': 'smooth',
            'inline': 'center',
        });
    }

    #unselectImage(thumbnailImageElement) {
        thumbnailImageElement.setAttribute('aria-selected', 'false');
        thumbnailImageElement.setAttribute('tabindex', '-1');
    }
}
