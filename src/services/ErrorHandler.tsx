/**
 * Interface that describes an errorMessage
 * @member errorType with pattern like `error.internet.api`
 * @member message the text to display
 * @member dismissable wether the message can be dismissed by the user
 */
export interface ErrorMessage {
	errorType: string;
	message: string;
	dissmisable: boolean;
}

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
	 * Adds the given message to the errorList
	 * unless some Message with same type and text already exists
	 * @param message the ErrorMessage to add
	 */
	static handleError(message: ErrorMessage): void;
	/**
	 * Adds a ErrorMessage with given parameters
	 * unless some Message with same type and text already exists
	 */
	static handleError(type: string, message: string, dismissable: boolean): void;
	static handleError(
		msg: ErrorMessage | string,
		message?: string,
		dismissable: boolean = false
	): void {
		if (typeof msg === 'string') {
			if (!message) return;
			return ErrorHandler.handleError({
				message: message,
				errorType: msg,
				dissmisable: dismissable,
			});
		}
		if (
			ErrorHandler.errorList.some(
				x => x.message == msg.message && x.errorType == msg.errorType
			)
		)
			return;
		ErrorHandler.errorList.push(msg);
		ErrorHandler.errorList.sort(ErrorHandler.compare);
	}

	/**
	 * Remove the ErrorMessage by reference
	 * @param message to remove
	 */
	static remError(message: ErrorMessage): void;
	/**
	 * Remove the ErrorMessage by its type
	 * @param errorType the type to remove
	 * @param includeSubtypes to include everything that starts with `errorType`
	 */
	static remError(errorType: string, includeSubtypes: boolean): void;
	static remError(
		msg: string | ErrorMessage,
		includeSubtypes: boolean = false
	): void {
		const oldLen = ErrorHandler.errorList.length;
		if (typeof msg === 'string') {
			ErrorHandler.errorList = ErrorHandler.errorList.filter(
				e => !messageTypeEquals(e, msg, includeSubtypes)
			);
		} else {
			const i = ErrorHandler.errorList.indexOf(msg);
			if (i != -1) ErrorHandler.errorList.splice(i, 1);
		}
		console.log('removed', oldLen - ErrorHandler.errorList.length, 'errors');
	}
}

// INITIALIZE
[
	{errorType: 'warning', message: '1. Testmessage', dissmisable: true},
	{
		errorType: 'warning.internet',
		message: '2. Testmessage',
		dissmisable: true,
	},
	{
		errorType: 'warning.location',
		message: '3. Testmessage',
		dissmisable: true,
	},
].forEach(ErrorHandler.handleError);
