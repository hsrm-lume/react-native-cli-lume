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
			return this.handleError({
				message: message,
				errorType: msg,
				dissmisable: dismissable,
			});
		}
		if (
			this.errorList.some(
				x => x.message == msg.message && x.errorType == msg.errorType
			)
		)
			return;
		this.errorList.push(msg);
		this.errorList.sort(ErrorHandler.compare);
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
		const oldLen = this.errorList.length;
		if (typeof msg === 'string') {
			this.errorList = this.errorList.filter(
				includeSubtypes
					? e => e.errorType.startsWith(msg)
					: e => e.errorType == msg
			);
		} else {
			const i = this.errorList.indexOf(msg);
			if (i != -1) this.errorList.splice(i, 1);
		}
		console.log('removed', oldLen - this.errorList.length, 'errors');
	}
}

// INITIALIZE
[
	{errorType: 'warning', message: '1. Testmessage', dissmisable: false},
	{
		errorType: 'warning.internet',
		message: '2. Testmessage',
		dissmisable: true,
	},
	{
		errorType: 'warning.location',
		message: '3. Testmessage',
		dissmisable: false,
	},
].forEach(ErrorHandler.handleError);
