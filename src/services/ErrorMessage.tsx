interface ErrorMessage{
    icon: "warning"|"locationWarning"|"locationError"|"internetWarning"|"apiConnection";
    message: string;
    dissmisable: boolean;
}

export default ErrorMessage;