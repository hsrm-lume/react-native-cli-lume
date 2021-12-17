import React from 'react';
import {ErrorMessage} from '../../services';
import {Icon} from './icon';
import WarningIcon from '../../assets/warning.svg';

export const ErrorIcon = (props: {
	msg: ErrorMessage;
	action?: (x?: any) => void;
}) => {
	return <Icon icon={WarningIcon} action={props.action} />;
};
