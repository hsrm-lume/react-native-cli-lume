import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FireScreen from './screens/fireScreen';
import WebScreen from './screens/webScreen';
import Fire from './assets/fire.svg';
import Map from './assets/map.svg';

//////////////
import {DevSettings} from 'react-native';
import {userDataSchema} from './types/UserDataSchema';
import {getDismissableErrors, getFullscreenErrors} from './services';
import IntroScreen from './screens/introScreen';

if (__DEV__) {
	DevSettings.addMenuItem('Clear Storage', () => {
		Realm.open({
			path: 'userOptions',
			schema: [userDataSchema],
			schemaVersion: 1,
		})
			.then(r =>
				r.write(() => {
					r.deleteAll();
				})
			)
			.then(() => console.log('cleaned storage. Reload app to see changes.'));
	});
	DevSettings.addMenuItem('readout errorlist', () => {
		console.log('ErrorList:');
		getFullscreenErrors().forEach(console.log);
		getDismissableErrors().forEach(console.log);
	});
}
////////////

export default function App() {
	const bottomNav = createBottomTabNavigator();

	return (
		<NavigationContainer>
			<bottomNav.Navigator
				screenOptions={({route}) => ({
					tabBarIcon: () => {
						if (route.name === 'FireScreen')
							return <Fire width={'100%'} height={'100%'} />;
						else if (route.name === 'WebScreen')
							return <Map width={'100%'} height={'100%'} />;
						else if (route.name === 'IntroScreen') return null;
						else return null;
					},
					headerShown: false,
					tabBarShowLabel: false,
				})}>
				<bottomNav.Screen name="FireScreen" component={FireScreen} />

				<bottomNav.Screen name="WebScreen" component={WebScreen} />
				<bottomNav.Screen
					name="IntroScreen"
					component={IntroScreen}
					options={{tabBarShowLabel: false, tabBarButton: props => null}}
				/>
			</bottomNav.Navigator>
		</NavigationContainer>
	);
}
