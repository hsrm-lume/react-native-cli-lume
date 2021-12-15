import React from 'react';

export const useOnInit = (callback: () => void) => {
	React.useEffect(() => {
		return callback();
	}, []);
};
