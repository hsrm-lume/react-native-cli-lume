import {ErrorMessage, MessageKey} from './Errors';

/**
 * @param msg the error message to test for the given type
 * @param type the type to test msg for
 * @param includeSubtypes wether to include subtypes
 * @returns true if msg matches type
 */
const messageTypeEquals = (
	msg: ErrorMessage,
	type: string,
	includeSubtypes: boolean
): boolean => {
	if (includeSubtypes)
		return (
			msg.errorType == type ||
			(msg.errorType.startsWith(type) && msg.errorType[type.length] == '.')
		);
	else return msg.errorType == type;
};

export class ErrorHandler {
	/**
	 * List of ErrorMessages
	 */
	static errorList: ErrorMessage[] = [];

	/**
	 * internal compare function to sort Errors by their dismissability
	 */
	private static compare(a: ErrorMessage, b: ErrorMessage) {
		if (a.dissmisable && !b.dissmisable) return -1;
		if (!a.dissmisable && b.dissmisable) return 1;
		return 0;
	}

	/**
	 * Adds a ErrorMessage with given parameters
	 * unless some Message with same type and text already exists
	 */
	static handleError(errorType: MessageKey, dismissable: boolean = true) {
		const msg: ErrorMessage = {
			errorType: errorType,
			dissmisable: dismissable,
		};

		if (ErrorHandler.errorList.some(x => x.errorType == msg.errorType)) return;

		ErrorHandler.errorList.push(msg);
		ErrorHandler.errorList.sort(ErrorHandler.compare);
	}

	/**
	 * Remove the ErrorMessage by its type
	 * @param errorType the type to remove
	 * @param includeSubtypes to include everything that starts with `errorType`
	 */
	static remError(errType: MessageKey, includeSubtypes: boolean = true) {
		const oldLen = ErrorHandler.errorList.length;
		ErrorHandler.errorList = ErrorHandler.errorList.filter(
			e => !messageTypeEquals(e, errType, includeSubtypes)
		);

		console.log('removed', oldLen - ErrorHandler.errorList.length, 'errors');
	}
}
