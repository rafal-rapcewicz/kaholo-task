const enum State {
    Pending,
    Fulfilled,
    Rejected
}

export default class Promise<T> {

    private _result: any;
    private _state = State.Pending;
    private _successFunction: Function;
    private _failFunction: Function;

    constructor(resolver: (
        resolve: (value: T) => void,
        reject: (reason: any) => void
    ) => void) {
        if (typeof resolver !== 'function') {
            throw new TypeError('Promise resolver is not a function');
        }

        let called = false;

        try {
            resolver(
                (value: T): void => {
                    if (called) {
                        // promise resolves only ones
                        return;
                    }

                    called = true;
                    this._resolve(value);
                },
                (reason: Error): void => {
                    if (called) {
                        // promise resolves only ones
                        return;
                    }

                    called = true;
                    this._reject(reason);
                }
            );
        } catch (error) {
            // promise resolves only ones
            if (!called) {
                called = true;
                this._reject(error);
            }
        }
    }

    static reject<T1>(reason: Error): Promise<T1> {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static resolve<T1>(value: T1) {
        return new Promise((resolve, reject) => {
            resolve(value);
        });
    }

    catch<R>(
        onRejected?: (reason: Error) => R
    ): Promise<R> {
        if (this._state === State.Rejected) {
            return new Promise((resolve, reject) => {
                reject(onRejected(this._result));
            });
        }

        this._failFunction = onRejected;
    }

    then<R>(
        onFulfilled: (value: T) => R,
        onRejected?: (reason: Error) => R
    ): Promise<R> {
        switch (this._state) {
            case State.Fulfilled:
                return new Promise((resolve, reject) => {
                    resolve(onFulfilled(this._result));
                });
            case State.Rejected:
                return new Promise((resolve, reject) => {
                    reject(onRejected(this._result));
                });
        }

        this._successFunction = onFulfilled;
        this._failFunction = onRejected;
    }

    private _reject(error: any) {
        this._state = State.Rejected;
        this._result = error;

        if (this._failFunction) {
            this._failFunction(this._result);
        }
    }

    private _resolve(value: T) {
        this._state = State.Fulfilled;
        this._result = value;

        if (this._successFunction) {
            this._successFunction(this._result);
        }
    }
}
