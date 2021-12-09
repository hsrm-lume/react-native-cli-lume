import React from 'react';

export const useOnDepsUpdate = (
	callback: React.EffectCallback,
	dependencies?: React.DependencyList
) => {
	const didMount = React.useRef(false);
	React.useEffect(() => {
		if (didMount.current) {
			console.log('calling back');
			return callback();
		} else {
			console.log('skipped effect');
			didMount.current = true;
		}
	}, dependencies?.concat(callback));
};
