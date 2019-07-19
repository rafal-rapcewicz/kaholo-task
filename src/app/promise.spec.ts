import Promise from './promise';

describe('promise', () => {

    it(`constructor should accept only functions'`, () => {
        expect(() => {
            new Promise(<any>200);
        }).toThrowError('Promise resolver is not a function');
    });

    describe('then', () => {
        it('should handle resolved value', () => {
            const expectedValue = 'expectedValue';
            let result;

            new Promise(resolve => {
                resolve(expectedValue);
            })
                .then(value => result = value);

            expect(result).toBe(expectedValue);
        });

        it('should support chaining', () => {
            let result1;
            let result2;
            let result3;

            new Promise(resolve => {
                resolve(1);
            })
                .then(value => {
                    result1 = value;

                    return 2;
                })
                .then(value => {
                    result2 = value;

                    return 3;
                })
                .then(value => {
                    result3 = value;
                });

            expect(result1).toBe(1);
            expect(result2).toBe(2);
            expect(result3).toBe(3);
        });
    });

    fdescribe('catch', () => {
        it('should handle reject value', () => {
            const expectedErrorMessage = 'ErrorMessage';
            let error: Error;

            new Promise(() => {
                throw new Error(expectedErrorMessage);
            })
                .catch(reason => error = reason);

            expect(error.message).toBe(expectedErrorMessage);
        });
    });

});
