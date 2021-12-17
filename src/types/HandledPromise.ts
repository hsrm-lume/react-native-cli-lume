import {ErrorHandler} from '../services/ErrorHandler';

/**
 * A promise where rejections are treated with an error handler
 * If the HandledPromise is rejected, the error handler is called
 */
export class HandledPromise<T> extends Promise<T> {
	promise: Promise<T>;

	constructor();
	constructor(
		executor: (
			resolve: (value: T | PromiseLike<T>) => void,
			reject: (reason?: any) => void
		) => void
	);
	constructor(promise: Promise<T>);
	constructor(
		promise?:
			| Promise<T>
			| ((
					resolve: (value: T | PromiseLike<T>) => void,
					reject: (reason?: any) => void
			  ) => void)
	) {
		super(() => {}); // no handler, all resolve & reject will be handled by the this.promise

		// construct some promise thet just resolves
		if (!promise) this.promise = new Promise<T>(r => r(undefined as any));
		// construct a HandledPromise from a Promise
		else if (promise instanceof Promise) this.promise = promise;
		// construct a HandledPromise from a PromiseLike
		else this.promise = new Promise<T>(promise);
		// add default handler
		this.promise.then(
			v => v,
			err => {
				ErrorHandler.handleError({
					errorType: 'error',
					message: err.message || err,
					dissmisable: true,
				});
			}
		);
	}

	override then<TResult1 = T, TResult2 = never>(
		onfulfilled?:
			| ((value: T) => TResult1 | PromiseLike<TResult1>)
			| undefined
			| null,
		onrejected?:
			| ((reason: any) => TResult2 | PromiseLike<TResult2>)
			| undefined
			| null
	): Promise<TResult1 | TResult2> {
		return this.promise.then(onfulfilled, onrejected);
	}

	override catch<TResult = never>(
		onrejected?:
			| ((reason: any) => TResult | PromiseLike<TResult>)
			| undefined
			| null
	): Promise<T | TResult> {
		return this.promise.catch(onrejected);
	}

	override finally(onfinally?: (() => void) | undefined | null): Promise<T> {
		return this.promise.finally(onfinally);
	}
}
