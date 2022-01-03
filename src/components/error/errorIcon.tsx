import React from 'react';
import {Icon} from './icon';
import WarningIcon from '../../assets/warning.svg';
import LocationErrorIcon from '../../assets/locationError.svg';
import InternetWarningIcon from '../../assets/internetWarning.svg';
import LocationWarningIcon from '../../assets/locationWarning.svg';
import {StyleProp, ViewStyle} from 'react-native';
import {MessageKey} from '../../services';

/**
 * @param t The type to be displayed
 * @returns the Icon for type t
 */
function getIcon(t: MessageKey) {
	switch (true) {
		case t.startsWith('error.location'):
			return LocationErrorIcon;
		case t.startsWith('warning.internet'):
			return InternetWarningIcon;
		case t.startsWith('warning.location'):
			return LocationWarningIcon;
		// case t.startsWith('warning'):
		// case t.startsWith('warning.qr'):
		// case t.startsWith('warning.nfc'):
		// case t.startsWith('warning.storage'):
		// case t.startsWith('error'):
		// case t.startsWith('error.qr'):
		// case t.startsWith('error.nfc'):
		// case t.startsWith('error.internet'):
		// case t.startsWith('error.storage'):
		default:
			return WarningIcon;
	}
}

export const ErrorIcon = (props: {
	errType: MessageKey;
	action?: (x?: any) => void;
	style?: StyleProp<ViewStyle>;
}) => {
	return (
		<Icon
			icon={getIcon(props.errType)}
			action={props.action}
			style={props.style}
		/>
	);
};
