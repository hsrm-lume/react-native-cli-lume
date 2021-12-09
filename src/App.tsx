import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FireScreen from './screens/fireScreen';
import WebScreen from './screens/webScreen';
import Fire from './assets/fire.svg';
import Map from './assets/map.svg';
import Warning from './assets/warning.svg';
import ErrorHandler from './services/ErrorHandler';
import ErrorMessage from './services/ErrorMessage';
import DebugScreen from './screens/debugScreen';

export default function App() {
	const bottomNav = createBottomTabNavigator();

	return (
		<NavigationContainer>
			<bottomNav.Navigator
				screenOptions={({route}) => ({
					tabBarIcon: () => {
						if (route.name === 'Fire')
							return <Fire width={'100%'} height={'100%'} />;
						else if (route.name === 'Web')
							return <Map width={'100%'} height={'100%'} />;
						else if (route.name === 'Debug')
							return <Warning width={'100%'} height={'100%'} />;
					},
					headerShown: false,
					tabBarShowLabel: false,
				})}>
				<bottomNav.Screen name="Debug" component={DebugScreen} />

				<bottomNav.Screen name="Fire" component={FireScreen} />

				<bottomNav.Screen name="Web" component={WebScreen} />
			</bottomNav.Navigator>
		</NavigationContainer>
	);
}
