interface ErrorMessage{
    icon: "geo"|"wifi"|"general";
    message: string;
    dissmisable: boolean;
}

class ErrorHandler {

    static errorList: Array<ErrorMessage> = [];
    

    static handleError(message: ErrorMessage) {
        this.errorList.push(message);
    }

}

export default ErrorHandler;
