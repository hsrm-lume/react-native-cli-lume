import React, {useState} from 'react';
import {
	getFullscreenErrors,
	registerErrorsChangeSubscription,
} from '../../services';
import FullErrorView from './fullErrorView';

const FullscreenErrors = (props: {action: () => void}) => {
	const [repaint, setRepaint] = useState(true);
	const repaintComponent = () => {
		setRepaint(!repaint);
	};
	registerErrorsChangeSubscription(repaintComponent);

	const e = getFullscreenErrors()[0];

	if (e)
		return (
			<FullErrorView item={e} action={{desc: 'Retry', action: props.action}} />
		);
	else return null;
};

export default FullscreenErrors;
