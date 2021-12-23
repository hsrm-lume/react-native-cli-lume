import React from 'react';
import {ErrorMessage} from '../../services';
import {Icon} from './icon';
import WarningIcon from '../../assets/warning.svg';
import LocationErrorIcon from '../../assets/locationError.svg';
import InternetWarningIcon from '../../assets/internetWarning.svg';
import LocationWarningIcon from '../../assets/locationWarning.svg';

function getIcon(errType: string) {
    var keyWords = errType.split(".");
    //only first two keywords are relevant for icon selection
    var iconKey = keyWords.length >= 2 ? keyWords[0] + "." + keyWords[1] : keyWords[0];
    switch (iconKey) {
        case 'error.location':
            return LocationErrorIcon;
        case 'warning.internet': 
            return InternetWarningIcon;
        case 'warning.location':
            return LocationWarningIcon;
        case 'warning':
        case 'warning.qr':
        case 'warning.nfc':
        case 'warning.storage':
        case 'error':            
        case 'error.qr':
        case 'error.nfc':
        case 'error.internet':
        case 'error.storage':
        default: 
            return WarningIcon;
    }
}

export const ErrorIcon = (props: {
	errType: string;
	action?: (x?: any) => void;
}) => {
    return <Icon icon={getIcon(props.errType)} action={props.action} />;	
};
