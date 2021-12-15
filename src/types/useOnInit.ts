import React from 'react';

export const useOnInit = (callback: () => void) => {
	const didMount = React.useRef(false);
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			callback();
		}
	}, [callback]);
};
