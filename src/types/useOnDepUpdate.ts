import React from 'react';

export const useOnDepUpdate = (
	callback: React.EffectCallback,
	dependency: [boolean]
) => {
	const ref = React.useRef(false);
	React.useEffect(() => {
		//console.log(ref.current !== dependency[0] ? 'pass' : 'block');
		if (ref.current !== dependency[0]) callback();
		ref.current = dependency[0];
	}, [dependency, callback]);
};
