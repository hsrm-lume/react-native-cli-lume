import {MessageKey} from '../services';
import {handleError, remError} from '../services/ErrorHandler';

type Executor<T> = (
	resolve: (value: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void
) => void;

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
	static from<T>(
		mKey: MessageKey | undefined,
		p: Promise<T>
	): HandledPromise<T> {
		return new HandledPromise(mKey, (res, rej) => p.then(res).catch(rej));
	}

	protected isLastInChain = true;
	protected promise: Promise<T>;
	protected mKey?: MessageKey;
	/**
	 * construct a HandledPromise from an executor
	 * @param executor The Executor to be ran in a HandledPromise
	 */
	constructor(mKey: MessageKey | undefined, executor: Executor<T>) {
		this.promise = new Promise<T>(executor);
		this.mKey = mKey;

		// add default handler
		defer(this.addDefaultHandler, this);
	}

	protected addDefaultHandler() {
		if (this.isLastInChain)
			this.promise.catch(err => {
				if (!this.mKey) return; // if no mKey, don't handle (undefined = ignore)
				console.warn('HandledPromise: ', this.mKey, err);
				handleError(this.mKey);
			});
	}

	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
	): HandledPromise<TResult1 | TResult2> {
		this.isLastInChain = false;
		return HandledPromise.from<TResult1 | TResult2>(
			this.mKey,
			this.promise.then(onfulfilled, onrejected)
		);
	}

	catch<TResult = never>(
		onrejected?: (reason: any) => TResult | PromiseLike<TResult>
	): HandledPromise<T | TResult> {
		this.isLastInChain = false;
		return new HandledPromise(this.mKey, resolve =>
			resolve(this.promise.catch(onrejected))
		);
	}

	finally(onfinally?: (() => void) | undefined | null): HandledPromise<T> {
		this.isLastInChain = false;
		return new HandledPromise<T>(this.mKey, resolve =>
			resolve(this.promise.finally(onfinally))
		);
	}
}
