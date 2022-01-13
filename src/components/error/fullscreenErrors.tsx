import React, {useState} from 'react';
import {
	changeSubscriptions,
	getFullscreenErrors,
} from '../../services';
import FullErrorView from './fullErrorView';

const FullscreenErrors = (props: {action: () => void}) => {
	const [repaint, setRepaint] = useState(true);
	const repaintComponent = () => {
		setRepaint(!repaint);
	};
	changeSubscriptions.registerSubscription(repaintComponent, 'fullscreen');

	const e = getFullscreenErrors()[0];

	if (e)
		return (
			<FullErrorView item={e} action={{desc: 'Retry', action: props.action}} />
		);
	else return null;
};

export default FullscreenErrors;
