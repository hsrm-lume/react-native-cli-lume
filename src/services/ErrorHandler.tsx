import ErrorMessage from './ErrorMessage';

class ErrorHandler {
	static errorList: Array<ErrorMessage> = [
        {errorType: 'warning', message: '1. Testmessage', dissmisable: false},
        {errorType: 'warning.internet', message: '2. Testmessage', dissmisable: true},
        {errorType: 'warning.location', message: '3. Testmessage', dissmisable: false},
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
				x => x.message == message.message && x.errorType == message.errorType
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

    static remErrorByValue(errorType: string, inclCh: boolean){
        var remList: Array<ErrorMessage> = [];
        var log = "remErrorByValue:\n";
        var oldLength = this.errorList.length;
        var newLength;
        var lengthChild;
        var lengthParent;

        remList = this.errorList.filter(e => e.errorType == errorType);
        lengthParent = remList.length;
        log = lengthParent == 0 ? log + "errorType=\"" + errorType + "\" could not be found!\n" 
            : log + "Found " + lengthParent + " item(s) with errorType=\"" + errorType + "\"\n";

        if (inclCh){
            errorType = errorType.charAt(errorType.length-1) == '.' ? errorType : errorType + ".";
            remList = remList.concat(this.errorList.filter(e => e.errorType.startsWith(errorType)));
            lengthChild = remList.length - lengthParent;

            log = lengthChild == 0 ? log + "Childs of \"" + errorType + "\" could not be found!\n" 
            : log + "Found " + lengthChild + " child(s) with parent=\"" + errorType + "\"\n";
        }

        remList.forEach(e => this.remError(e));
        newLength = this.errorList.length;

        log = log + remList.length + " item(s) deleted from errorList.\nOld length: " + oldLength + "; New length: " + newLength;
        console.log(log);
    }
}

export default ErrorHandler;


