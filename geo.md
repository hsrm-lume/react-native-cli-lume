# GeoService

## About

This component is used by the [`fireScreen.tsx`](src/screens/fireScreen.tsx) to get the current position. You can subscribe to this GeoService to get a new position every 1-5 seconds. If you dont need any new positions you can also unsubscribe to this service. If the geo-accuracy of the device is too bad for the second time an error will be shown.

## Usage

```typescript
import {GeoServiceSubscription, subscribePosition} from '../services';
import {GeoLocation} from '../types/GeoLocation';

const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
useEffect(() => {
	if (!posPermission) {
		return;
	}
	let sub: GeoServiceSubscription;
	sub = subscribePosition(posUpdate => {
		posChange(posUpdate);
	});
	return () => {
		sub?.unsubscribe();
	};
}, [posPermission, retryAfterError]);
```

## Dependencies

This GeoService uses the [react-native-geolocation-service](https://github.com/Agontuk/react-native-geolocation-service) package.
