import { uuidv4 } from '../dcf-utility.js';
import DCFCollapsibleFieldsets from './dcf-collapsible-fieldset.js';

export default class DCFImageCropper {

    uuid = uuidv4();

    cropperElement = null;

    cropperCanvas = null;

    cropperCanvasContext = null;

    imageSource = null;

    imageToBeCropped = null;

    guideFieldsetElement = null;

    gridGuidesCheckbox = null;

    gridGuides = false;

    centerGuidesCheckbox = null;

    centerGuides = false;

    cropperScaleRange = null;

    croppedX = -1;

    croppedY = -1;

    croppedScale = 100;

    minCroppedScale = 25;

    cropperMaxWidth = -1;

    croppedRatio = 1;

    canvasSize = 300;

    imagePreviews = [];

    mouseState = {
        down: false,
        downX: -1,
        croppedX: -1,
        downY: -1,
        croppedY: -1,
    };

    constructor(imageCropper, options = {}) {
        this.cropperElement = imageCropper;

        if (
            this.cropperElement.getAttribute('id') === '' ||
            this.cropperElement.getAttribute('id') === null
        ) {
            this.cropperElement.setAttribute('id', this.uuid.concat('-image-cropper-container'));
        }

        // Finds the image file input
        this.imageSource = document.getElementById(this.cropperElement.dataset.imageCropperInput);
        if (this.imageSource === null) {
            throw new Error('Missing image cropper file input');
        }

        // Figure out the cropper ratio
        switch (this.cropperElement.dataset.ratio) {
        case '1x1':
            this.croppedRatio = 1;
            break;
        case '16x9':
            this.croppedRatio = 16/9;
            break;
        case '9x16':
            this.croppedRatio = 9/16;
            break;
        case '3x4':
            this.croppedRatio = 3/4;
            break;
        case '4x3':
            this.croppedRatio = 4/3;
            break;
        default:
            this.croppedRatio = 1;
        }

        // Sets the cropperElement's inner HTML
        this.#setInnerHTMLCropper();

        // Finds all the image previews
        this.imagePreviews = document.querySelectorAll(`.dcf-image-cropper-preview[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`);

        // We do this separate from the main cropper since the main cropper might have a preview in it
        this.#setInnerHTMLPreviews();

        // Set up cropperElement's canvas
        this.cropperCanvas = document.getElementById(this.uuid.concat('-image-cropper-canvas'));
        this.cropperCanvasContext = this.cropperCanvas.getContext('2d');
        this.canvasSize = parseInt(this.cropperElement.dataset.maxCanvasWidth, 10);
        if (this.canvasSize <= 20) {
            this.canvasSize = 300;
        }

        // Find the cropper scale slider
        this.cropperScaleRange = document.getElementById(this.uuid.concat('-image-cropper-scale'));

        // Sets up the cropperElement's fieldset
        this.guideFieldsetElement = document.getElementById(this.uuid.concat('-image-cropper-guides'));

        // This needs to be done before we set up the fieldset
        // initializing the fieldset resets eventlisteners inside the fieldset
        this.#setUpEventListeners();

        // Initialize the fieldset
        if (options.collapsibleFieldset === undefined) {
            new DCFCollapsibleFieldsets(this.guideFieldsetElement);
        } else {
            new options.collapsibleFieldset(this.guideFieldsetElement);
        }

        // Initialize the state of the component
        this.#changeState();

        // Mark the component as initialized and dispatch ready event
        this.cropperElement.classList.add('dcf-image-cropper-initialized');
        this.cropperElement.removeAttribute('hidden');
        this.imagePreviews.forEach((previewElement) => {
            previewElement.removeAttribute('hidden');
        });
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

    /**
     * Sets the inner HTML to the cropped element and the image previews
     * @returns { Void }
     */
    #setInnerHTMLCropper() {
        this.cropperElement.innerHTML = `
<div class="dcf-image-cropper-no-image">
    <p>No image selected</p>
</div>
<section
    class="dcf-image-cropper-yes-image dcf-d-none"
    aria-labelledby="${this.uuid.concat('-image-cropper-title')}"
>
    <p id="${this.uuid.concat('-image-cropper-title')}">Image Cropper Tool</p>
    <div class="dcf-d-flex dcf-jc-center dcf-ai-center dcf-gap-3 dcf-mb-3">
        <canvas
            id="${this.uuid.concat('-image-cropper-canvas')}"
            class="dcf-b-grey dcf-b-2 dcf-b-solid"
            height="225"
            width="300"
            tabindex="0"
            aria-label="Image Crop Area Display"
            role="img"
            aria-describedby="${this.uuid.concat('-image-cropper-instructions')}"
        ></canvas>
        <div class="dcf-d-flex dcf-flex-col dcf-jc-center dcf-ai-start dcf-mb-3">
            <p>Preview</p>
            <div
                class="dcf-image-cropper-preview"
                data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"
                data-max-canvas-width="150"
                hidden
            ></div>
        </div>
        <div id="${this.uuid.concat('-image-cropper-status')}" role="status" aria-live="polite"></div>
    </div>

    <div class="dcf-input-group dcf-col-gap-vw dcf-mb-3">
        <label for="${this.uuid.concat('-image-cropper-scale')}">Selection size: </label>
        <input
            id="${this.uuid.concat('-image-cropper-scale')}"
            type="range" min="${this.minCroppedScale}"
            max="100"
            value="100"
            aria-controls="${this.uuid.concat('-image-cropper-canvas')}">
    </div>

    <fieldset class="dcf-collapsible-fieldset" data-start-expanded="false" id="${this.uuid.concat('-image-cropper-guides')}">
        <legend>Guides</legend>
        <div class="dcf-input-checkbox">
            <input
                id="${this.uuid.concat('-image-cropper-grid-guides')}"
                type="checkbox"
                aria-controls="${this.uuid.concat('-image-cropper-canvas')}"
            >
            <label for="${this.uuid.concat('-image-cropper-grid-guides')}">Grid guides </label>
        </div>
        <div class="dcf-input-checkbox">
            <input
                id="${this.uuid.concat('-image-cropper-center-guides')}"
                type="checkbox"
                aria-controls="${this.uuid.concat('-image-cropper-canvas')}"
            >
            <label for="${this.uuid.concat('-image-cropper-center-guides')}">Center guides </label>
        </div>
    </fieldset>

    <p id="${this.uuid.concat('-image-cropper-instructions')}" class="dcf-txt-sm dcf-mt-3">
        To select a portion of your image, click and drag the cropped area to position
        it, or use the arrow keys for precise adjustments. Modify the size of the cropped area
        using the slider or fine-tune with the plus and minus buttons for a personalized fit.
        Toggle on the guides to help align your cropped area perfectly.
    </p>
</section>`;
    }

    #setInnerHTMLPreviews() {
        this.imagePreviews.forEach((previewElement, index) => {
            previewElement.innerHTML = `
<div class="dcf-image-cropper-yes-image dcf-d-none">
    <canvas
        id="${this.uuid.concat(`-image-cropper-preview-canvas-${index}`)}"
        class="dcf-b-grey dcf-b-2 dcf-b-solid"
        height="225"
        width="300"
        aria-label="Cropped Image Preview"
        role="img"></canvas>
</div>
`;
        });
    }

    /**
     * Sets up event listeners for the various interactive elements
     * @returns { Void }
     */
    #setUpEventListeners() {
        this.imageSource.addEventListener('change', this.#changeState.bind(this));

        this.cropperScaleRange.addEventListener('input', () => { this.updateScale(); });

        this.guideFieldsetElement.addEventListener('collapsibleFieldsetReady', () => {
            this.gridGuidesCheckbox = document.getElementById(this.uuid.concat('-image-cropper-grid-guides'));
            this.gridGuidesCheckbox.addEventListener('change', () => {
                this.gridGuides = this.gridGuidesCheckbox.checked;
                this.#draw();
            });
            this.centerGuidesCheckbox = document.getElementById(this.uuid.concat('-image-cropper-center-guides'));
            this.centerGuidesCheckbox.addEventListener('change', () => {
                this.centerGuides = this.centerGuidesCheckbox.checked;
                this.#draw();
            });
        });

        this.cropperCanvas.addEventListener('mousedown', (event) => {
            console.log('Down', event.clientX, event.clientY);
            this.mouseState.down = true;
            this.mouseState.downX = event.clientX;
            this.mouseState.croppedX = this.croppedX;
            this.mouseState.downY = event.clientY;
            this.mouseState.croppedY = this.croppedY;
        });
        this.cropperCanvas.addEventListener('mousemove', (event) => {
            if (!this.mouseState.down) { return; }
            console.log('Move', event.clientX, event.clientY);
            const deltaX = event.clientX - this.mouseState.downX;
            const deltaY = event.clientY - this.mouseState.downY;

            this.croppedX = this.mouseState.croppedX + deltaX;
            this.croppedY = this.mouseState.croppedY + deltaY;

            this.#checkIfBoxIsInBounds();
            this.#draw();
            this.#syncInputs();

            // Update current mouse state with new state
            // This fixes weirdness when the box hits the walls
            this.mouseState.downX = event.clientX;
            this.mouseState.croppedX = this.croppedX;
            this.mouseState.downY = event.clientY;
            this.mouseState.croppedY = this.croppedY;
        });
        this.cropperCanvas.addEventListener('mouseup', (event) => {
            if (!this.mouseState.down) { return; }
            console.log('Up', event.clientX, event.clientY);
            this.mouseState.down = false;
            this.mouseState.downX = -1;
            this.mouseState.croppedX = -1;
            this.mouseState.downY = -1;
            this.mouseState.croppedY = -1;
        });
        this.cropperCanvas.addEventListener('mouseleave', (event) => {
            if (!this.mouseState.down) { return; }
            console.log('Up', event.clientX, event.clientY);
            this.mouseState.down = false;
            this.mouseState.downX = -1;
            this.mouseState.croppedX = -1;
            this.mouseState.downY = -1;
            this.mouseState.croppedY = -1;
        });

        this.cropperElement.addEventListener('keydown', (event) => {
            console.log('keydown', event);
        });
    }

    /**
     * When the image source changes this will update the component's state
     * @returns { Void }
     */
    async #changeState() {
        // There is no image so update things to show no image
        if (this.imageSource.value === '') {
            this.cropperElement.querySelector('.dcf-image-cropper-yes-image').classList.add('dcf-d-none');
            this.cropperElement.querySelector('.dcf-image-cropper-no-image').classList.remove('dcf-d-none');

            this.imagePreviews.forEach((previewElement) => {
                previewElement.querySelector('.dcf-image-cropper-yes-image').classList.add('dcf-d-none');
            });

            this.#clearInputs();

            return;
        }

        // If we made it here then we do have an image

        // Get the image and draw it to the canvas
        this.imageToBeCropped = await this.#getSrcImage();
        this.#draw();

        // Show the image canvas and hide the no image selected message
        this.cropperElement.querySelector('.dcf-image-cropper-yes-image').classList.remove('dcf-d-none');
        this.cropperElement.querySelector('.dcf-image-cropper-no-image').classList.add('dcf-d-none');

        this.imagePreviews.forEach((previewElement) => {
            previewElement.querySelector('.dcf-image-cropper-yes-image').classList.remove('dcf-d-none');
        });

        this.#syncInputs();
    }

    updateScale() {
        this.croppedScale = parseInt(this.cropperScaleRange.value, 10);
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    moveUp(delta=5) {
        this.croppedY -= delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    moveDown(delta=5) {
        this.croppedY += delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    moveLeft(delta=5) {
        this.croppedX -= delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    moveRight(delta=5) {
        this.croppedX += delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    grow(delta=5) {
        this.croppedScale += delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    shrink(delta=5) {
        this.croppedScale -= delta;
        this.#checkIfBoxIsInBounds();
        this.#draw();
        this.#syncInputs();
    }

    #checkIfBoxIsInBounds() {
        if (this.croppedScale < this.minCroppedScale) {
            this.croppedScale = this.minCroppedScale;
        }
        if (this.croppedScale > 100) {
            this.croppedScale = 100;
        }

        const croppedWidth = (this.cropperMaxWidth * (this.croppedScale / 100));
        const croppedHeight = (this.cropperMaxWidth * (this.croppedScale / 100)) / this.croppedRatio;
        if (this.croppedX > this.cropperCanvas.width - croppedWidth) {
            this.croppedX = this.cropperCanvas.width - croppedWidth;
        }
        if (this.croppedY > this.cropperCanvas.height - croppedHeight) {
            this.croppedY = this.cropperCanvas.height - croppedHeight;
        }

        if (this.croppedY < 0) {
            this.croppedY = 0;
        }
        if (this.croppedX < 0) {
            this.croppedX = 0;
        }
    }

    #draw() {
        this.cropperCanvasContext.drawImage(
            this.imageToBeCropped,
            0,
            0,
            this.cropperCanvas.width,
            this.cropperCanvas.height,
        );

        this.cropperCanvasContext.strokeStyle = 'black';
        this.cropperCanvasContext.lineWidth = 4;
        this.#drawLines();

        this.cropperCanvasContext.strokeStyle = 'white';
        this.cropperCanvasContext.lineWidth = 2;
        this.#drawLines();

        const croppedWidth = (this.cropperMaxWidth * (this.croppedScale / 100));
        const croppedHeight = (this.cropperMaxWidth * (this.croppedScale / 100)) / this.croppedRatio;

        this.imagePreviews.forEach((previewElement) => {
            const previewCanvas = previewElement.querySelector('canvas');
            const previewContext = previewCanvas.getContext('2d');

            let previewSize = parseInt(previewElement.dataset.maxCanvasWidth, 10);
            if (previewSize <= 20) {
                previewSize = this.canvasSize;
            }

            if (this.croppedRatio > 1) {
                previewCanvas.width = previewSize;
                previewCanvas.height = previewSize / this.croppedRatio;
            } else {
                previewCanvas.width = previewSize / (1 / this.croppedRatio);
                previewCanvas.height = previewSize;
            }

            // Scale factors from canvas back to original image
            const scaleX = this.imageToBeCropped.width / this.cropperCanvas.width;
            const scaleY = this.imageToBeCropped.height / this.cropperCanvas.height;

            // Get the cropped region in original image coordinates
            const scaledX = this.croppedX * scaleX;
            const scaledY = this.croppedY * scaleY;
            const scaledWidth = croppedWidth * scaleX;
            const scaledHeight = croppedHeight * scaleY;

            // Draw the cropped area into the preview canvas
            previewContext.drawImage(
                this.imageToBeCropped,
                scaledX, scaledY, scaledWidth, scaledHeight,     // source rect (in original image)
                0, 0, previewCanvas.width, previewCanvas.height, // destination rect (fit to preview canvas)
            );
        });
    }

    #drawLines() {
        const croppedWidth = (this.cropperMaxWidth * (this.croppedScale / 100));
        const croppedHeight = (this.cropperMaxWidth * (this.croppedScale / 100)) / this.croppedRatio;

        if (this.centerGuides) {
            this.cropperCanvasContext.beginPath();
            this.cropperCanvasContext.moveTo(this.croppedX, this.croppedY);
            this.cropperCanvasContext.lineTo(this.croppedX + croppedWidth, this.croppedY + croppedHeight);
            this.cropperCanvasContext.moveTo(this.croppedX, this.croppedY + croppedHeight);
            this.cropperCanvasContext.lineTo(this.croppedX + croppedWidth, this.croppedY);
            this.cropperCanvasContext.stroke();
        }

        if (this.gridGuides) {
            this.cropperCanvasContext.beginPath();
            this.cropperCanvasContext.moveTo(this.croppedX + (croppedWidth / 3), this.croppedY);
            this.cropperCanvasContext.lineTo(this.croppedX + (croppedWidth / 3), this.croppedY + croppedHeight);
            this.cropperCanvasContext.moveTo(this.croppedX + (2 * croppedWidth / 3), this.croppedY);
            this.cropperCanvasContext.lineTo(this.croppedX + (2 * croppedWidth / 3), this.croppedY + croppedHeight);
            this.cropperCanvasContext.moveTo(this.croppedX, this.croppedY + (croppedHeight / 3));
            this.cropperCanvasContext.lineTo(this.croppedX + croppedWidth, this.croppedY + (croppedHeight / 3));
            this.cropperCanvasContext.moveTo(this.croppedX, this.croppedY + (2 * croppedHeight / 3));
            this.cropperCanvasContext.lineTo(this.croppedX + croppedWidth, this.croppedY + (2 * croppedHeight / 3));
            this.cropperCanvasContext.stroke();
        }

        this.cropperCanvasContext.strokeRect(this.croppedX, this.croppedY, croppedWidth, croppedHeight);
    }

    #clearInputs() {
        this.cropperScaleRange.value = '100';

        // dcf-image-cropper-x inputs
        document.querySelectorAll(`.dcf-image-cropper-x[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-x2 inputs
        document.querySelectorAll(`.dcf-image-cropper-x2[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-y inputs
        document.querySelectorAll(`.dcf-image-cropper-y[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-y2 inputs
        document.querySelectorAll(`.dcf-image-cropper-y2[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-width inputs
        document.querySelectorAll(`.dcf-image-cropper-width[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-height inputs
        document.querySelectorAll(`.dcf-image-cropper-height[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '-1';
        });

        // dcf-image-cropper-ratio inputs
        document.querySelectorAll(`.dcf-image-cropper-ratio[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (this.croppedRatio).toFixed(2);
        });

        // dcf-image-cropper-ratio-text inputs
        document.querySelectorAll(`.dcf-image-cropper-ratio-text[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            switch ((this.croppedRatio).toFixed(2)) {
            case ((3/4).toFixed(2)):
                inputElement.value = '3x4';
                break;
            case ((4/3).toFixed(2)):
                inputElement.value = '4x3';
                break;
            case ((9/16).toFixed(2)):
                inputElement.value = '9x16';
                break;
            case ((16/9).toFixed(2)):
                inputElement.value = '16x9';
                break;
            default:
                inputElement.value = '1x1';
            }
        });

        // dcf-image-cropper-cropped-image inputs
        document.querySelectorAll(`.dcf-image-cropper-cropped-image[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = '';
        });
    }

    #syncInputs() {
        this.cropperScaleRange.value = this.croppedScale;

        const scaleX = this.imageToBeCropped.width / this.cropperCanvas.width;
        const scaleY = this.imageToBeCropped.height / this.cropperCanvas.height;

        const croppedWidth = (this.cropperMaxWidth * (this.croppedScale / 100));
        const croppedHeight = (this.cropperMaxWidth * (this.croppedScale / 100)) / this.croppedRatio;

        // dcf-image-cropper-x inputs
        document.querySelectorAll(`.dcf-image-cropper-x[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleX * this.croppedX).toFixed(2);
        });

        // dcf-image-cropper-x2 inputs
        document.querySelectorAll(`.dcf-image-cropper-x2[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleX * (this.croppedX + croppedWidth)).toFixed(2);
        });

        // dcf-image-cropper-y inputs
        document.querySelectorAll(`.dcf-image-cropper-y[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleY * this.croppedY).toFixed(2);
        });

        // dcf-image-cropper-y2 inputs
        document.querySelectorAll(`.dcf-image-cropper-y2[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleY * (this.croppedY + croppedHeight)).toFixed(2);
        });

        // dcf-image-cropper-width inputs
        document.querySelectorAll(`.dcf-image-cropper-width[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleX * croppedWidth).toFixed(2);
        });

        // dcf-image-cropper-height inputs
        document.querySelectorAll(`.dcf-image-cropper-height[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (scaleY * croppedHeight).toFixed(2);
        });

        // dcf-image-cropper-ratio inputs
        document.querySelectorAll(`.dcf-image-cropper-ratio[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            inputElement.value = (this.croppedRatio).toFixed(2);
        });

        // dcf-image-cropper-ratio-text inputs
        document.querySelectorAll(`.dcf-image-cropper-ratio-text[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`).forEach((inputElement) => {
            switch ((this.croppedRatio).toFixed(2)) {
            case ((3/4).toFixed(2)):
                inputElement.value = '3x4';
                break;
            case ((4/3).toFixed(2)):
                inputElement.value = '4x3';
                break;
            case ((9/16).toFixed(2)):
                inputElement.value = '9x16';
                break;
            case ((16/9).toFixed(2)):
                inputElement.value = '16x9';
                break;
            default:
                inputElement.value = '1x1';
            }
        });

        // dcf-image-cropper-cropped-image inputs
        const croppedImageInputs = document.querySelectorAll(`.dcf-image-cropper-cropped-image[data-image-cropper-input="${this.cropperElement.dataset.imageCropperInput}"]`);
        if (croppedImageInputs.length > 0) {
            this.#getCroppedImageSrc().then((croppedImageFile) => {
                croppedImageInputs.forEach((inputElement) => {
                    const dataTransferObj = new DataTransfer();
                    dataTransferObj.items.add(croppedImageFile);
                    inputElement.files = dataTransferObj.files;
                });
            });
        }
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
                if (imageObj.width > imageObj.height) {
                    this.cropperCanvas.width = this.canvasSize;
                    this.cropperCanvas.height = this.canvasSize / aspectRatio;
                } else {
                    this.cropperCanvas.width = this.canvasSize / (1 / aspectRatio);
                    this.cropperCanvas.height = this.canvasSize;
                }

                if (this.cropperCanvas.width / this.croppedRatio > this.cropperCanvas.height) {
                    this.cropperMaxWidth = this.cropperCanvas.height / (1 / this.croppedRatio);
                } else {
                    this.cropperMaxWidth = this.cropperCanvas.width;
                }

                this.croppedX = 0;
                this.croppedY = 0;
                this.cropperScale = 100;

                resolve(imageObj);
            };

            // Assigns the file uploaded's url to the image object
            imageObj.src = imageFileURL;
        });
    }

    async #getCroppedImageSrc() {
        const hiddenCanvas = document.createElement('canvas');
        const hiddenCanvasContext = hiddenCanvas.getContext('2d');

        const previewSize = 1000;
        if (this.croppedRatio > 1) {
            hiddenCanvas.width = previewSize;
            hiddenCanvas.height = previewSize / this.croppedRatio;
        } else {
            hiddenCanvas.width = previewSize / (1 / this.croppedRatio);
            hiddenCanvas.height = previewSize;
        }

        const croppedWidth = (this.cropperMaxWidth * (this.croppedScale / 100));
        const croppedHeight = (this.cropperMaxWidth * (this.croppedScale / 100)) / this.croppedRatio;

        // Scale factors from canvas back to original image
        const scaleX = this.imageToBeCropped.width / this.cropperCanvas.width;
        const scaleY = this.imageToBeCropped.height / this.cropperCanvas.height;

        // Get the cropped region in original image coordinates
        const scaledX = this.croppedX * scaleX;
        const scaledY = this.croppedY * scaleY;
        const scaledWidth = croppedWidth * scaleX;
        const scaledHeight = croppedHeight * scaleY;

        // Draw the cropped area into the preview canvas
        hiddenCanvasContext.drawImage(
            this.imageToBeCropped,
            scaledX, scaledY, scaledWidth, scaledHeight,     // source rect (in original image)
            0, 0, hiddenCanvas.width, hiddenCanvas.height, // destination rect (fit to preview canvas)
        );

        // Convert the canvas back to a Blob
        const blob = await new Promise(resolve => hiddenCanvas.toBlob(resolve, this.imageToBeCropped.type));

        // Convert the Blob into a File (so it can go into another <input type="file">)
        return new File([blob], 'cropped_image', { type: this.imageToBeCropped.type });
    }
}
