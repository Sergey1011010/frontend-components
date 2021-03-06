import { asyncValidator, asyncValidatorDebouncedWrapper, setFirstValidated } from '../../addSourceWizard/SourceAddSchema';
import * as actions from '../../api/index';

describe('asyncNameValidator', () => {
    const returnedSourceResponse = {
        data: {
            sources: [
                { id: '1', name: 'a1' }
            ]
        }
    };

    const emptySourceResponse = {
        data: { sources: [ ] }
    };

    const requiredMessage = 'Required';

    it('returns error message when name is taken', () => {
        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        return asyncValidator('a1').then(data => expect(data).toEqual('Name has already been taken'));
    });

    it('returns nothing when name is taken but by the same catalog', () => {
        actions.findSource = jest.fn(() => Promise.resolve(returnedSourceResponse));

        return asyncValidator('a1', '1').then(data => expect(data).toEqual(undefined));
    });

    it('returns error message when name is undefined', () => {
        actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

        return asyncValidator(undefined).then(data => expect(data).toEqual(requiredMessage));
    });

    it('returns error message when name is blank', () => {
        actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

        return asyncValidator('').then(data => expect(data).toEqual(requiredMessage));
    });

    it('returns nothing when passes', () => {
        actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

        return asyncValidator('a1').then(data => expect(data).toEqual(undefined));
    });

    describe('wrapper', () => {
        beforeEach(() => {
            setFirstValidated(true);
        });

        it('returns required and then the debounced function when creating', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper()()).toEqual('Required');

            expect(asyncValidatorDebouncedWrapper()()).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper()()).toEqual(expect.any(Promise));
        });

        it('returns function when editing', () => {
            actions.findSource = jest.fn(() => Promise.resolve(emptySourceResponse));

            expect(asyncValidatorDebouncedWrapper()('a1', '1')).toEqual(expect.any(Promise));
            expect(asyncValidatorDebouncedWrapper()('a1', '1')).toEqual(expect.any(Promise));
        });
    });
});
