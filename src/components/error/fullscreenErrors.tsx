import React, {useState} from 'react';
import {changeSubscriptions, getFullscreenErrors} from '../../services';
import FullErrorView from './fullErrorView';

const FullscreenErrors = (props: {action: () => void}) => {
	// state to trigger repainting of this component
	const [repaint, setRepaint] = useState(true);
	const repaintComponent = () => setRepaint(!repaint);

	// trigger repainting of this component if the error list changes
	changeSubscriptions.registerSubscription(repaintComponent, 'fullscreen');

	// get the first error of the fullscreen list
	const e = getFullscreenErrors()[0];

	// return a full error view if there an error is found, else return nothig
	return e ? (
		<FullErrorView item={e} action={{desc: 'Retry', action: props.action}} />
	) : null;
};

export default FullscreenErrors;
