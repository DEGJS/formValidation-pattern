import pattern from '../src/pattern';

describe('Form Validation: pattern', () => {
    describe('settings', () => {
        it ('should have default message', () => {
            const expectedVal = 'Please match the field format.';
            const patternInst = pattern();
            const settings = patternInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('message');
            expect(settings.message).toEqual(expectedVal);
        });

        it('should have default messageAttr', () => {
            const expectedVal = 'data-validation-pattern-message';
            const patternInst = pattern();
            const settings = patternInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('messageAttr');
            expect(settings.messageAttr).toEqual(expectedVal);
        });

        it('should have default events', () => {
            const patternInst = pattern();
            const settings = patternInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('events');
            expect(settings.events).toHaveLength(2);
            expect(settings.events).toContain('focusout');
            expect(settings.events).toContain('submit');
        });

        it('should overwrite defaults, if values passed in', () => {
            const newSettings = {
                message: "I pity the fool that can't match the pattern"
            };
            const expectedVal = {
                message: "I pity the fool that can't match the pattern",
                messageAttr: 'data-validation-pattern-message',
                events: [
                    'focusout',
                    'submit'
                ]
            };

            const patternInst = pattern(newSettings);
            expect(patternInst.settings).toEqual(expectedVal);
        });
    });    

    describe('isRelevant', () => {
        it('should return true if some input has pattern attribute', () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => 'true'
                    }
                ]
            }
            const patternInst = pattern();
            expect(patternInst.isRelevant(mockField)).toEqual(true);
        });

        it('should return false if no inputs have pattern attribute', () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    }
                ]
            }
            const patternInst = pattern();
            expect(patternInst.isRelevant(mockField)).toEqual(false);
        });
    });

    describe('postprocessMessage', () => {
        it('should call postprocessMessage if defined and is function', () => {
            const settings = {
                postprocessMessage: jest.fn(msg => 'The message made it.')
            };
            const mockMessage = 'I am a mock message.';
            const patternInst = pattern(settings);
            const retVal = patternInst.postprocessMessage(mockMessage);

            expect(settings.postprocessMessage).toHaveBeenCalled();
            expect(settings.postprocessMessage).toHaveBeenCalledWith(mockMessage);
            expect(retVal).toEqual('The message made it.');
        });

        it('should return msg if not function', () => {
            const settings = {
                postprocessMessage: 'I am not a function'
            };
            const mockMessage = 'I am a mock message.';
            const patternInst = pattern(settings);
            const retVal = patternInst.postprocessMessage(mockMessage);

            expect(retVal).toEqual(mockMessage);
        });

        it('should return msg if no postprocessMessage', () => {
            const mockMessage = 'I am a mock message.';
            const patternInst = pattern();
            const retVal = patternInst.postprocessMessage(mockMessage);

            expect(retVal).toEqual(mockMessage);
        });
    });

    describe('validate', () => {
        it('should reject if no inputs', async () => {
            const mockField = {};
            const patternInst = pattern();
            await expect(patternInst.validate(mockField)).rejects.toEqual('pattern: No inputs set.');
        });

        it('should return true if input has no value', async () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => /[0-9]*/,
                        value: ''
                    }
                ]
            };
            const expectedResponse = {valid: true};
            const patternInst = pattern();
            await expect(patternInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

        it('should return true if input passes regex', async () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => /[0-9]*/,
                        value: '12345'
                    }
                ]
            };
            const expectedResponse = {valid: true};
            const patternInst = pattern();
            await expect(patternInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

        it('should return false if input val does not pass regex', async () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => /[0-9]/,
                        value: 'test'
                    }
                ]
            };
            const expectedResponse = {valid: false};
            const patternInst = pattern();
            await expect(patternInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

    });
})