export default class DCFFileSizeValidator {

    fileInputElement = null;

    errorElement = null;

    errorElementClassList = [];

    formattedSizeOutputs = [];

    sizeLimit = -1;

    validationFailedClass = null;

    constructor(fileInput, options) {

        if ('errorElementClassList' in options && Array.isArray(options.errorElementClassList)) {
            this.errorElementClassList = options.errorElementClassList;
        }

        // Get the input element
        this.fileInputElement = fileInput;
        if (this.fileInputElement.getAttribute('id') === null) {
            throw new Error('File Input element is missing ID');
        }

        this.formattedSizeOutputs = document.querySelectorAll(`.dcf-file-size-validator-size[data-input="${this.fileInputElement.getAttribute('id')}"]`);

        // Get the max size limit
        this.sizeLimit = this.#parseSize(this.fileInputElement.dataset.maxSize);
        this.validationFailedClass = this.fileInputElement.dataset.validationFailedClass;

        this.formattedSizeOutputs.forEach((singleOutputElement) => {
            singleOutputElement.innerHTML = this.#formatSize(this.sizeLimit);
        });

        // Set up error element and add it after the input element
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add(...this.errorElementClassList);
        this.errorElement.classList.add('dcf-d-none!');
        this.fileInputElement.after(this.errorElement);

        // Run logic when the file input's file changes
        this.fileInputElement.addEventListener('change', () => {
            this.errorElement.classList.add('dcf-d-none!');
            if (this.validationFailedClass !== null) {
                this.fileInputElement.classList.remove(this.validationFailedClass);
            }

            // There is no file so we are good
            if (this.fileInputElement.files.length === 0) {
                return;
            }

            // File is too big do not keep it and show error
            if (this.fileInputElement.files[0].size > this.sizeLimit) {
                const filename = this.fileInputElement.files[0].name;

                this.fileInputElement.value = '';
                if (this.validationFailedClass !== null) {
                    this.fileInputElement.classList.add(this.validationFailedClass);
                }
                this.fileInputElement.dispatchEvent(new CustomEvent('change'));

                this.errorElement.innerText = `The file '${filename}' is too large!`;
                this.errorElement.classList.remove('dcf-d-none!');
                return;
            }
        });

        // Component is initialized and Dispatch the event to notify that the component is ready
        this.fileInputElement.classList.add('dcf-file-size-validator-initialized');
        this.fileInputElement.removeAttribute('hidden');
        this.fileInputElement.dispatchEvent(new CustomEvent(DCFFileSizeValidator.events('fileSizeValidatorReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
            fileSizeValidatorReady: 'fileSizeValidatorReady',
        };
        Object.freeze(events);

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }

    #parseSize(sizeValue) {
        if (typeof sizeValue !== 'string') {
            throw new Error('parseSize: input must be a string');
        }

        const input = sizeValue.trim();

        // Match 'number' + optional 'unit'
        const match = /^(\d+(\.\d+)?)([a-zA-Z]+)?$/.exec(input);
        if (!match) {
            throw new Error(`Invalid file size value: '${sizeValue}'`);
        }

        const numericValue = parseFloat(match[1]);
        const unitString = match[3] ? match[3].toLowerCase() : '';

        /// PHP-style units: K, M, G, T, P (1024-based)
        const phpUnitMap = {
            kil: 1024,      // acts as 'k'
            meg: 1024 ** 2, // acts as 'm'
            gig: 1024 ** 3, // acts as 'g'
            ter: 1024 ** 4, // acts as 't'
            pet: 1024 ** 5, // acts as 'p'
        };

        // Decimal units (1000-based)
        const decimalUnitMap = {
            byt: 1,           // 'b'
            kilb: 1000,       // 'kb'
            megb: 1000 ** 2,  // 'mb'
            gigb: 1000 ** 3,  // 'gb'
            terab: 1000 ** 4, // 'tb'
            petab: 1000 ** 5, // 'pb'
        };

        // Binary units (1024-based)
        const binaryUnitMap = {
            kib: 1024,
            mib: 1024 ** 2,
            gib: 1024 ** 3,
            tib: 1024 ** 4,
            pib: 1024 ** 5,
        };

        // Convert unitString into one of our keys:
        // Because PHP uses 1-letter units, we map 'k' → 'kil', 'm' → 'meg', etc.
        // We are doing it this way to avoid eslint errors
        let phpUnitKey = null;
        if (unitString === 'k') {
            phpUnitKey = 'kil';
        } else if (unitString === 'm') {
            phpUnitKey = 'meg';
        } else if (unitString === 'g') {
            phpUnitKey = 'gig';
        } else if (unitString === 't') {
            phpUnitKey = 'ter';
        } else if (unitString === 'p') {
            phpUnitKey = 'pet';
        }

        if (phpUnitKey !== null && phpUnitMap[phpUnitKey]) {
            return numericValue * phpUnitMap[phpUnitKey];
        }

        // decimal: kb, mb, gb, etc.
        // We are doing it this way to avoid eslint errors
        let decimalKey = null;
        if (unitString === 'b') {
            decimalKey = 'byt';
        } else if (unitString === 'kb') {
            decimalKey = 'kilb';
        } else if (unitString === 'mb') {
            decimalKey = 'megb';
        } else if (unitString === 'gb') {
            decimalKey = 'gigb';
        } else if (unitString === 'tb') {
            decimalKey = 'terab';
        } else if (unitString === 'pb') {
            decimalKey = 'petab';
        }

        if (decimalKey !== null && decimalUnitMap[decimalKey]) {
            return numericValue * decimalUnitMap[decimalKey];
        }

        // binary: kib, mib, gib, etc.
        if (binaryUnitMap[unitString]) {
            return numericValue * binaryUnitMap[unitString];
        }

        // No unit means bytes
        if (unitString === '') {
            return numericValue;
        }

        throw new Error(`Unrecognized size unit "${unitString}" in "${sizeValue}"`);
    }


    #formatSize(sizeInBytes) {
        const gigabyte = 1024 ** 3;
        const megabyte = 1024 ** 2;
        const kilobyte = 1024;

        if (sizeInBytes >= gigabyte) {
            const gigValue = Math.round(sizeInBytes / gigabyte);
            return `${gigValue}<abbr title="Gigabytes">GB</abbr>`;
        }

        if (sizeInBytes >= megabyte) {
            const megValue = Math.round(sizeInBytes / megabyte);
            return `${megValue}<abbr title="Megabytes">MB</abbr>`;
        }

        if (sizeInBytes >= kilobyte) {
            const kilValue = Math.round(sizeInBytes / kilobyte);
            return `${kilValue}<abbr title="Kilobytes">KB</abbr>`;
        }

        return `${sizeInBytes} bytes`;
    }

}
