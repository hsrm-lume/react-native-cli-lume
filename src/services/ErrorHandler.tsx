import {isDismissableError} from '.';
import {isFullscreenError, MessageKey} from './Errors';

/**
 * @param msg the error message to test for the given type
 * @param type the type to test msg for
 * @param includeSubtypes wether to include subtypes
 * @returns true if msg matches type
 */
const messageTypeEquals = (
	msg: MessageKey,
	type: string,
	includeSubtypes: boolean
): boolean => {
	if (includeSubtypes)
		return msg == type || (msg.startsWith(type) && msg[type.length] == '.');
	else return msg == type;
};

let errorList: MessageKey[] = [];

export const getFullscreenErrors = (): MessageKey[] =>
	errorList.filter(isFullscreenError);
export const getDismissableErrors = (): MessageKey[] =>
	errorList.filter(isDismissableError);

class ChangeSubscriptions {
	private changeSubscriptions: {bar?: () => void; fullscreen?: () => void} = {};
	/**
	 * Register a new change subscription
	 */
	registerSubscription(s: () => void,
	from: 'bar' | 'fullscreen') {
		this.changeSubscriptions[from] = s;
	}
	/**
	 * Trigger all subscriptions
	 */
	trigger() {
		this.changeSubscriptions.bar?.();
		this.changeSubscriptions.fullscreen?.();
	}
}
export const changeSubscriptions = new ChangeSubscriptions();

/**
 * Adds a MessageKey with given parameters
 * unless some Message with same key already exists
 */
export const handleError = (errorType: MessageKey) => {
	if (errorList.some(x => x == errorType)) return;

	errorList.push(errorType);
	changeSubscriptions.trigger()
};

/**
 * Remove the Error by its Message key
 * @param errorType the key to remove
 * @param includeSubtypes to include everything that starts with `errorType`
 */
export const remError = (errType: string, includeSubtypes: boolean = true) => {
	errorList = errorList.filter(
		e => !messageTypeEquals(e, errType, includeSubtypes)
	);
	changeSubscriptions.trigger()
};
