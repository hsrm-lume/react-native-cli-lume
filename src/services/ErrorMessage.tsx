interface ErrorMessage{
    errorType: string;  //errorType by pattern error.internet.api...
    message: string;
    dissmisable: boolean;
}

export default ErrorMessage;