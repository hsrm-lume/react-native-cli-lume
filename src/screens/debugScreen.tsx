import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DebugTile from '../components/debugTile';
import {
	GeoServiceSubscription,
	getPermission,
	getUserData,
	subscribePosition,
} from '../services';
import {GeoLocation} from '../types';
import {UserData} from '../types/UserData';

// Changes on useState wil always rerun entire component function
// useEffect(() => {...], []); makes the effect run only once (on initial render)

export default function DebugScreen() {
	const [userData, userDataChange] = useState<UserData | undefined>(undefined);
	useEffect(() => {
		getUserData().then(ud => {
			if (ud.fireStatus == userData?.fireStatus && ud.uuid == userData?.uuid)
				return;
			userDataChange(ud);
			console.log('fetched', ud);
		});
	}, []);

	const [permission, permissionChange] = useState<string>('unknown');
	const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
	let sub: GeoServiceSubscription;
	useEffect(() => {
		console.log('getting permission');
		getPermission('android.permission.ACCESS_FINE_LOCATION').then(() => {
			permissionChange('granted');
			sub = subscribePosition(pos => {
				posChange(pos);
			});
		});
		return () => {
			console.log('unsubscribing');
			sub?.unsubscribe();
		};
	}, []);

	return (
		<View style={styles.debugWrapper}>
			<DebugTile desc={'FireState: ' + userData?.fireStatus} />
			<DebugTile desc={'uuid: ' + userData?.uuid} />
			<DebugTile desc={'location acess: ' + permission} />
			<DebugTile
				desc={
					'pos: ' +
					(pos
						? JSON.stringify(pos)
								.replace(/({|,|})"/gm, '$1\n\t"')
								.replace('}', '\n}')
						: 'unknown')
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	debugWrapper: {
		flex: 1,
		width: '100%',
		padding: 10,
	},
});
