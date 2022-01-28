import React from 'react';
import {Icon} from '../icon';
import WarningIcon from '../../assets/warning.svg';
import InternetWarningIcon from '../../assets/internetWarning.svg';
import LocationWarningIcon from '../../assets/locationWarning.svg';
import LoadingIcon from '../../assets/loading.svg';
import {StyleProp, ViewStyle} from 'react-native';
import {MessageKey} from '../../services';

/**
 * Maps error types to icons with defined rules
 * @param t The type to be displayed
 * @returns the Icon for type t
 */
function getIcon(t: MessageKey) {
	switch (true) {
		case t.startsWith('loading'):
			return LoadingIcon;
		case t.startsWith('internet'):
			return InternetWarningIcon;
		case t.startsWith('location'):
			return LocationWarningIcon;
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
