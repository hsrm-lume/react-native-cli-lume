import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ErrorBar from '../components/error/errorBar';
import FullErrorView from '../components/error/fullErrorView';
import FireView from '../components/fire/fire';
import {FireOffLogic} from '../components/fire/fireOffLogic';
import {FireOnLogic} from '../components/fire/fireOnLogic';
import {
	ErrorHandler,
	GeoServiceSubscription,
	getPermission,
	getUserData,
	subscribePosition,
} from '../services';
import {useOnInit, UserData} from '../types';
import {GeoLocation} from '../types/GeoLocation';

export default function FireScreen() {
	// userData
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({uuid: userData.uuid, fireStatus: fs});
	};

	const [repaint, setRepaint] = useState(true);
	const repaintMainComponent = () => {
		setRepaint(!repaint);
	};
	ErrorHandler.changeSubscriptions.push(repaintMainComponent);

	useOnInit(() => {
		getUserData().then(ud => {
			if (ud.fireStatus == userData.fireStatus && ud.uuid == userData.uuid)
				return; // no change if values already match
			userDataChange(ud);
			console.log('fetched', ud);
		});
	});

	// position
	const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
	useOnInit(() => {
		let sub: GeoServiceSubscription;
		console.log('getting permission');
		getPermission('android.permission.ACCESS_FINE_LOCATION').then(() => {
			sub = subscribePosition(pos => {
				posChange(pos);
			});
		});
		return () => {
			sub?.unsubscribe();
		};
	});

	// rendering
	return (
		<LinearGradient
			colors={
				userData.fireStatus ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			{pos && userData.fireStatus !== undefined && userData.uuid ? ( // only render logic if data ready
				<>
					<FireView fire={userData.fireStatus || false} />
					<ErrorBar />
					{userData.fireStatus ? (
						<FireOnLogic uuid={userData.uuid} location={pos} /> // render fire logic dependent on fire state
					) : (
						<FireOffLogic
							userData={{uuid: userData.uuid, fireStatus: userData.fireStatus}}
							fireUpdater={fireStatusChange}
							location={pos}
						/>
					)}
				</>
			) : (
				<FullErrorView
					item={{
						errorType: 'warning.internet.map.loading',
						dissmisable: false,
					}}
					action={() => {
						console.log('fixed');
					}}
					fixBtnText="Go to Settings"
				/>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		alignItems: 'center',
	},
	text1: {
		fontSize: 30,
		color: '#000000',
	},
	button: {
		height: '10%',
		width: '70%',
		backgroundColor: '#abb0ba',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
