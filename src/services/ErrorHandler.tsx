import {Errors} from './Errors';

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
	 * Adds a ErrorMessage with given parameters
	 * unless some Message with same type and text already exists
	 */
	static handleError(errorType: string, dismissable: boolean = false) {
		const msg: ErrorMessage = {
            errorType: errorType, 
            message: Errors.getMessage(errorType), 
            dissmisable: dismissable};

		if (ErrorHandler.errorList.some(x => x.errorType == msg.errorType)) return;
        
		ErrorHandler.errorList.push(msg);
		ErrorHandler.errorList.sort(ErrorHandler.compare);
	}


	/**
	 * Remove the ErrorMessage by its type
	 * @param errorType the type to remove
	 * @param includeSubtypes to include everything that starts with `errorType`
	 */
	static remError(errType: string, includeSubtypes: boolean = false){
		const oldLen = ErrorHandler.errorList.length;
		ErrorHandler.errorList = ErrorHandler.errorList.filter(
            e => !messageTypeEquals(e, errType, includeSubtypes)
        );
		
		console.log('removed', oldLen - ErrorHandler.errorList.length, 'errors');
	}
}
// INITIALIZE

ErrorHandler.handleError("warning.internet.device", true);
ErrorHandler.handleError("warning.location.sonstwas");
ErrorHandler.handleError("error.location.egal");
ErrorHandler.handleError("error");