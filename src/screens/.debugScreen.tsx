import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DebugTile from '../components/.debugTile';
import {FireOffLogic} from '../components/fire/fireOffLogic';
import {FireOnLogic} from '../components/fire/fireOnLogic';
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
// dependency array gets foreach diffed with `Object.is(a,b)` (=> `a.equals(b)`)

export default function DebugScreen() {
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({uuid: userData.uuid, fireStatus: fs});
	};
	useEffect(() => {
		getUserData().then(ud => {
			if (ud.fireStatus == userData.fireStatus && ud.uuid == userData.uuid)
				return; // no change if values already match
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
			<DebugTile desc={'FireState: ' + userData.fireStatus} />
			<DebugTile desc={'uuid: ' + userData.uuid} />
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
			{pos && userData.fireStatus !== undefined && userData.uuid ? ( // only render logic if data ready
				userData.fireStatus ? ( // render fire logic dependent on fire state
					<FireOnLogic uuid={userData.uuid} location={pos} />
				) : (
					<FireOffLogic
						userData={{uuid: userData.uuid, fireStatus: userData.fireStatus}}
						fireUpdater={fireStatusChange}
						location={pos}
					/>
				)
			) : null}
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
