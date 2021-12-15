import ErrorMessage from './ErrorMessage';

class ErrorHandler {
	static errorList: Array<ErrorMessage> = [
		{icon: 'warning', message: 'Initiale Testmessage', dissmisable: true},
	];

	static handleError(message: ErrorMessage) {
		if (
			!this.errorList.some(
				x => x.message == message.message && x.icon == message.icon
			)
		) {
			this.errorList.push(message);
		}
	}

	static remError(message: ErrorMessage) {
		var i = this.errorList.indexOf(message);
		if (i != -1) {
			this.errorList.splice(i, 1);
		}
	}
}

export default ErrorHandler;
