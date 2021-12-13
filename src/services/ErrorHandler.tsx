import ErrorMessage from './ErrorMessage';

class ErrorHandler {
	static errorList: Array<ErrorMessage> = [
        {icon: 'warning', message: '1. Testmessage', dissmisable: false},
        {icon: 'internetWarning', message: '2. Testmessage', dissmisable: true},
        {icon: 'locationWarning', message: '3. Testmessage', dissmisable: false},
    ];

    static compare(a: ErrorMessage, b: ErrorMessage) {
        if (a.dissmisable && !b.dissmisable) {
          return -1;
        }
        if (!a.dissmisable && b.dissmisable) {
          return 1;
        }
        return 0;
      }
      

	static handleError(message: ErrorMessage) {
		if (
			!this.errorList.some(
				x => x.message == message.message && x.icon == message.icon
			)
		) {
			this.errorList.push(message);
		}
        this.errorList.sort((a,b) => this.compare(a,b))
	}

	static remError(message: ErrorMessage) {
		var i = this.errorList.indexOf(message);
		if (i != -1) {
			this.errorList.splice(i, 1);
		}
	}
}

export default ErrorHandler;
