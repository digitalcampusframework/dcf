import { uuidv4 } from '../dcf-utility.js';
import DCFCollapsibleFieldsets from './dcf-collapsible-fieldset.js';

export default class DCFImageCropper {

    uuid = uuidv4();

    cropperElement = null;

    cropperCanvas = null;

    cropperCanvasContext = null;

    fieldsetElement = null;

    imageSource = null;

    constructor(imageCropper, options = {}) {
        this.cropperElement = imageCropper;

        if (
            this.cropperElement.getAttribute('id') === '' ||
            this.cropperElement.getAttribute('id') === null
        ) {
            this.cropperElement.setAttribute('id', this.uuid.concat('-image-cropper-container'));
        }

        // Sets the cropperElement's inner HTML
        this.#setInnerHTML();

        // Set up cropperElement's canvas
        this.cropperCanvas = document.getElementById(this.uuid.concat('-image-cropper-canvas'));
        this.cropperCanvasContext = this.cropperCanvas.getContext('2d');

        // Sets up the cropperElement's fieldset
        this.fieldsetElement = document.getElementById(this.uuid.concat('-image-cropper-guides'));
        if (options.collapsibleFieldset === undefined) {
            new DCFCollapsibleFieldsets(this.fieldsetElement);
        } else {
            new options.collapsibleFieldset(this.fieldsetElement);
        }

        // Finds the image file input
        console.log(this.cropperElement.dataset.dataImageCropperInput);
        this.imageSource = document.getElementById(this.cropperElement.dataset.imageCropperInput);
        if (this.imageSource === null) {
            throw new Error('Missing image cropper file input');
        }
        this.imageSource.addEventListener('change', this.#changeState.bind(this));
        this.#changeState();

        this.cropperElement.classList.add('dcf-image-cropper-initialized');
        this.cropperElement.removeAttribute('hidden');
        this.cropperElement.dispatchEvent(new CustomEvent(DCFImageCropper.events('imageCropperReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
            imageCropperReady: 'imageCropperReady',
        };
        Object.freeze(events);

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }

    #setInnerHTML() {
        this.cropperElement.innerHTML = `
<div class="dcf-image-cropper-no-image">
    <p>No image selected</p>
</div>
<div class="dcf-image-cropper-yes-image dcf-d-none">
    <div class="dcf-d-flex dcf-jc-center dcf-ai-center dcf-mb-3">
        <canvas id="${this.uuid.concat('-image-cropper-canvas')}" class="dcf-b-grey dcf-b-2 dcf-b-solid" height="225" width="300" aria-hidden="true"></canvas>
    </div>
    <div class="dcf-input-group dcf-col-gap-vw dcf-mb-3">
        <label for="${this.uuid.concat('-image-cropper-scale')}">Selection size: </label>
        <input id="${this.uuid.concat('-image-cropper-scale')}" type="range" min="50" max="100" value="100">
    </div>
    <fieldset class="dcf-collapsible-fieldset" data-start-expanded="false" id="${this.uuid.concat('-image-cropper-guides')}">
        <legend>Guides</legend>
        <div class="dcf-input-checkbox">
            <input id="${this.uuid.concat('-image-cropper-grid-guides')}" type="checkbox">
            <label for="${this.uuid.concat('-image-cropper-grid-guides')}">Grid guides </label>
        </div>
        <div class="dcf-input-checkbox">
            <input id="${this.uuid.concat('-image-cropper-center-guides')}" type="checkbox">
            <label for="${this.uuid.concat('-image-cropper-center-guides')}">Center guides </label>
        </div>
    </fieldset>

    <p id="${this.uuid.concat('-image-cropper-instructions')}" class="dcf-txt-sm dcf-mt-3">
        To select a portion of your image for your avatar, click and drag the square to position
        it, or use the arrow keys for precise adjustments. Modify the size of the selected area
        using the slider or fine-tune with the plus and minus buttons for a personalized fit.
        Use the guides to help align your avatar.
    </p>
</div>`;
    }

    async #changeState() {
        if (this.imageSource.value === '') {
            this.cropperElement.querySelector('.dcf-image-cropper-yes-image').classList.add('dcf-d-none');
            this.cropperElement.querySelector('.dcf-image-cropper-no-image').classList.remove('dcf-d-none');
            return;
        }

        const imageObj = await this.#getSrcImage();
        this.cropperCanvasContext.drawImage(imageObj, 0, 0, this.cropperCanvas.width, this.cropperCanvas.height);

        this.cropperElement.querySelector('.dcf-image-cropper-yes-image').classList.remove('dcf-d-none');
        this.cropperElement.querySelector('.dcf-image-cropper-no-image').classList.add('dcf-d-none');
    }

    #getSrcImage() {
        return new Promise((resolve, reject) => {
            // If there is no file then there is no reason to continue
            if (this.imageSource.files[0] === undefined) {
                reject();
            }

            // Creates a URL to the file uploaded
            const imageFile = this.imageSource.files[0];
            const imageFileURL = URL.createObjectURL(imageFile);

            // Creates a new image object to put the image in
            const imageObj = new Image();

            // Assigns callback once the image is loaded
            imageObj.onload = () => {
                // Destroys the URL for that image file
                URL.revokeObjectURL(imageFileURL);

                // Calculates the aspect ratio of the image
                const aspectRatio = imageObj.width / imageObj.height;

                // Sets up the canvas size
                this.cropperCanvas.width = 300;
                this.cropperCanvas.height = 300 / aspectRatio;
                resolve(imageObj);
            };

            // Assigns the file uploaded's url to the image object
            imageObj.src = imageFileURL;
        });
    }
}
