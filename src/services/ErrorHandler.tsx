import ErrorMessage from './ErrorMessage';

class ErrorHandler {
	static errorList: Array<ErrorMessage> = [];

	static handleError(message: ErrorMessage) {
		// if (
		// 	!this.errorList.some(
		// 		x => x.message == message.message && x.icon == message.icon
		// 	)
		// ) {
		this.errorList.push(message);
		// }
	}

	static remError(message: ErrorMessage | number) {
		if (typeof message !== 'number') message = this.errorList.indexOf(message);
		if (message != -1) {
			this.errorList.splice(message, 1);
		}
	}
}

export default ErrorHandler;
