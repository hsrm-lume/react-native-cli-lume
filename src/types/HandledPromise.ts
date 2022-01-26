import {MessageKey} from '../services';
import {handleError} from '../services/ErrorHandler';

/**
 * General definition of an executing function.
 * (like in usual JS Promises)
 */
type Executor<T> = (
	resolve: (value: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void
) => void;

/**
 * Helper function to schedule a function-call to be executed after the current event loop iteration.
 * For more on JS event loop @see https://developer.mozilla.org/de/docs/Web/JavaScript/EventLoop
 * @param fn Function to be executed.
 * @param thisVal this-object that gets bound to the function.
 * @param args arguments to be passed to the function.
 */
function defer(fn: Function, thisVal: any, ...args: any[]) {
	setTimeout(() => fn.apply(thisVal, args), 0);
}

/**
 * A promise where rejections are treated with an error handler
 * If the HandledPromise is rejected, the error handler is called
 * @param executor The Executor to be ran in a HandledPromise or a Promise to convert
 * @returns a Handled Promise
 */
export class HandledPromise<T> {
	/**
	 * construct a HandledPromise from a Promise
	 * @param promise the promise to be handled
	 */
	static from<K>(
		mKey: MessageKey | undefined,
		p: Promise<K>
	): HandledPromise<K> {
		return new HandledPromise(mKey, (res, rej) => p.then(res).catch(rej));
	}

	/**
	 * The inner promise that gets wrapped by this classes instance
	 */
	protected promise: Promise<T>;

	/**
	 * the MessageKey ot the ErrorMessage that gets thrown if the promise is rejected
	 */
	protected mKey?: MessageKey;

	/**
	 * construct a HandledPromise from an executor
	 * @param mKey the messageKey to be used if the promise is rejected
	 * @param executor The Executor to be ran in a HandledPromise
	 */
	constructor(mKey: MessageKey | undefined, executor: Executor<T>) {
		this.promise = new Promise<T>(executor);
		this.mKey = mKey;

		// add default handler
		defer(this.addDefaultHandler, this);
	}

	/**
	 * Adds a default error handler to the promise
	 * If a messageKey is set, the error is handled with the error handler
	 */
	protected addDefaultHandler() {
		this.promise.catch(err => {
			if (!this.mKey) return; // if no mKey, don't handle (undefined = ignore)
			console.warn('HandledPromise: ', this.mKey, err);
			handleError(this.mKey);
		});
	}

	// Following methods are alike the ones in usual JS Promises
	// but return a HandledPromise instead of a Promise to keep
	// the HandledPromises as a closed set under chaining operations

	/**
	 * Promise method just like in usual JS Promises
	 * it passes the current messageKey down the promise chain
	 */
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
	): HandledPromise<TResult1 | TResult2> {
		return HandledPromise.from<TResult1 | TResult2>(
			this.mKey,
			this.promise.then(onfulfilled, onrejected)
		);
	}

	/**
	 * Promise method just like in usual JS Promises
	 * it passes the current messageKey down the promise chain
	 */
	catch<TResult = never>(
		onrejected?: (reason: any) => TResult | PromiseLike<TResult>
	): HandledPromise<T | TResult> {
		return new HandledPromise(this.mKey, resolve =>
			resolve(this.promise.catch(onrejected))
		);
	}

	/**
	 * Promise method just like in usual JS Promises
	 * it passes the current messageKey down the promise chain
	 */
	finally(onfinally?: (() => void) | undefined | null): HandledPromise<T> {
		return new HandledPromise<T>(this.mKey, resolve =>
			resolve(this.promise.finally(onfinally))
		);
	}
}
