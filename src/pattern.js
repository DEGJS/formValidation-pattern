const pattern = (options) => {

    const defaults = {
        message: 'Please match the field format.',
        messageAttr: 'data-validation-pattern-message',
        events: [
            'focusout',
            'submit'
        ]
    };
    let settings = Object.assign({}, defaults, options);

    const getSettings = () => {
        return settings;
    }

    const isRelevant = (field) => {
        return field.inputEls.some(el => el.getAttribute('pattern') !== null);
    }

    const validate = (field) => {
        return new Promise(function(resolve, reject) {
            if (field.inputEls) {
                resolve({
					valid: field.inputEls.some(el => {
						const pattern = new RegExp(el.getAttribute('pattern'));
                        return el.value.length === 0 || (el.value.length > 0 && pattern.test(el.value));
					})
                });
            } else {
                reject('pattern: No inputs set.');
            }
        });
    }

    const postprocessMessage = (msg) => {
        if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
            return settings.postprocessMessage(msg);
        } else {
            return msg;
        }
    }

    return {
        settings: getSettings(),
        isRelevant: isRelevant,
        validate: validate,
        postprocessMessage: postprocessMessage
    };

}

export default pattern;