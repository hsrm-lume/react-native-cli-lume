import {resolveObjectURL} from 'buffer';
import Geolocation from 'react-native-geolocation-service';

interface GeoLocation {
    lng: string;
    lat: string;
}
class GeoService {
    constructor() {}

    async getLocation(): Promise<GeoLocation | void> {
        const res = {} as GeoLocation;
        return new Promise(resolve => {
            Geolocation.getCurrentPosition(
                pos => {
                    res.lat = pos.coords.latitude.toString();
                    res.lng = pos.coords.longitude.toString();
                    resolve(res);
                },
                () => {
                    resolve(undefined);
                }
            );
        });
    }
}

export default GeoService;
