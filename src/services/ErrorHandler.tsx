import {Alert} from 'react-native';

export class ErrorHandler {
	static handleError(
		title: string,
		msg: string,
		twoButtons: boolean,
		callbackOk: () => void = () => {},
		callbackCancel: () => void = () => {}
	) {
		var buttonCancel = {
			text: 'Cancel',
			onPress: callbackCancel,
		};

		var buttonOk = {
			text: 'Ok',
			onPress: callbackOk,
		};

		if (twoButtons) var buttons = [buttonCancel, buttonOk];
		else var buttons = [buttonOk];

		Alert.alert(title, msg, buttons);
	}
}
