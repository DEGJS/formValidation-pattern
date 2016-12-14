let pattern = function() {

	let messages = {
			patternMismatchMsg: {
				attribute: 'data-validation-pattern-message',
				message: 'Please match the field format.'
			}
		},
		events = [
			'focusout',
			'submit'
		];

	function getEvents() {
		return events;
	};

	function isRelevant(containerEl, inputEls) {
		return inputEls.every(function(el) {
			return el.getAttribute('pattern') !== null;
		});
	};

	function validate(matchingField) {
		return new Promise(function(resolve, reject) {
			let inputEls = matchingField.inputEls;
			if ((inputEls) && (inputEls.length > 0)) {
				let input = inputEls[0],
					pattern = new RegExp(input.getAttribute('pattern'));
				if((input.value) && (input.value.length > 0)) {
					if (pattern.test(input.value)) {
						resolve({
							valid: true
						});
					} else {
						resolve({
							valid: false,
							message: messages.patternMismatchMsg,
							matchingField: matchingField
						});
					}
				} else {
					resolve({
						valid: true
					});
				}
			} else {
				reject('no inputs');
			}
			
		});
	};

	return {
		events: getEvents,
		isRelevant: isRelevant,
		validate: validate
	}

};

export default pattern;