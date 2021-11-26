import {Alert} from 'react-native';

class ErrorHandler {
    static handleError(msg: string) {
        Alert.alert(
            "Error",  // title
            msg,  // message
            [  // buttons
                {  // left button
                    text: "Later",
                    onPress: () => Alert.alert("Later Pressed")
                },
                {  // middle button
                    text: "Cancel",
                    onPress: () => Alert.alert("Cancel Pressed")
                },
                {  // right button
                    text: "OK",
                    onPress: () => Alert.alert("OK Pressed")
                }
            ],
            {  // options
                cancelable: true,
                onDismiss: () => Alert.alert("alert dismissed by tapping outside")
            }
        );
    }
}

export default ErrorHandler;
