/**
 * A promise where rejections are treated with an error handler
 * If the HandledPromise is rejected, the error handler is called
 */
export class HandledPromise<T> extends Promise<T> {
	promise: Promise<T>;

	constructor(
		executor: (
			resolve: (value: T | PromiseLike<T>) => void,
			reject: (reason?: any) => void
		) => void
	);
	constructor(promise: Promise<T>);
	constructor(
		promise:
			| Promise<T>
			| ((
					resolve: (value: T | PromiseLike<T>) => void,
					reject: (reason?: any) => void
			  ) => void)
	) {
		super(() => {}); // no handler, all resolve & reject will be handled by the this.promise
		if (promise instanceof Promise) {
			this.promise = promise;
			return;
		}
		this.promise = new Promise<T>(promise);
		this.promise = this.promise.catch(err => {
			console.warn('DEFAULT WARNING CATCHER', err);
			return err;
		});
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
}
